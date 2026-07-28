import type { ProviderExecutors } from "../../core/types.ts";

import { optionalString } from "../../core/cast.ts";
import {
  defineProviderExecutors,
  readProviderJson,
  requireApiKeyCredential,
} from "../provider-runtime.ts";
import type { ProviderFetch } from "../provider-runtime.ts";

// Envelope endpoint paths are the confirmed resource; verify against the OpenAPI at docs.annature.com.au.
const API_BASE = "https://api.annature.com.au";

interface AnnatureContext {
  privateKey: string;
  publicKey: string;
  fetcher: ProviderFetch;
  signal?: AbortSignal;
}

async function annatureGet<T>(context: AnnatureContext, path: string): Promise<T> {
  const response = await context.fetcher(`${API_BASE}${path}`, {
    headers: {
      "X-Annature-Id": context.publicKey,
      "X-Annature-Key": context.privateKey,
      accept: "application/json",
    },
    signal: context.signal,
  });
  return readProviderJson<T>(response, "Annature");
}

export const executors: ProviderExecutors = defineProviderExecutors<AnnatureContext>({
  service: "annature",
  handlers: {
    list_envelopes: (_input, context) => annatureGet(context, "/envelopes"),
    get_envelope: (input, context) => annatureGet(context, `/envelopes/${encodeURIComponent(String(input.id))}`),
  },
  async createContext(context, fetcher): Promise<AnnatureContext> {
    const credential = await requireApiKeyCredential(context, "annature");
    return {
      privateKey: credential.apiKey,
      publicKey: optionalString(credential.values.publicKey) ?? "",
      fetcher,
      signal: context.signal,
    };
  },
});
