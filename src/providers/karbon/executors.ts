import type { ProviderExecutors } from "../../core/types.ts";

import { optionalString } from "../../core/cast.ts";
import {
  defineProviderExecutors,
  readProviderJson,
  requireApiKeyCredential,
  setSearchParams,
} from "../provider-runtime.ts";
import type { ProviderFetch } from "../provider-runtime.ts";

const API_BASE = "https://api.karbonhq.com/v3";

interface KarbonContext {
  appKey: string;
  tenantKey: string;
  fetcher: ProviderFetch;
  signal?: AbortSignal;
}

async function karbonGet<T>(
  context: KarbonContext,
  path: string,
  query: Record<string, string | undefined> = {},
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  setSearchParams(url, query);
  const response = await context.fetcher(url.toString(), {
    headers: {
      authorization: `Bearer ${context.appKey}`,
      AccessKey: context.tenantKey,
      accept: "application/json",
    },
    signal: context.signal,
  });
  return readProviderJson<T>(response, "Karbon");
}

export const executors: ProviderExecutors = defineProviderExecutors<KarbonContext>({
  service: "karbon",
  handlers: {
    list_contacts: (input, context) =>
      karbonGet(context, "/Contacts", {
        $filter: typeof input.filter === "string" && input.filter ? input.filter : undefined,
      }),
    list_organizations: (input, context) =>
      karbonGet(context, "/Organizations", {
        $filter: typeof input.filter === "string" && input.filter ? input.filter : undefined,
      }),
    get_work_item: (input, context) =>
      karbonGet(context, `/WorkItems/${encodeURIComponent(String(input.key))}`),
  },
  async createContext(context, fetcher): Promise<KarbonContext> {
    const credential = await requireApiKeyCredential(context, "karbon");
    return {
      appKey: credential.apiKey,
      tenantKey: optionalString(credential.values.tenantKey) ?? "",
      fetcher,
      signal: context.signal,
    };
  },
});
