import type { ProviderExecutors } from "../../core/types.ts";
import type { ApiKeyProviderContext } from "../provider-runtime.ts";

import { defineApiKeyProviderExecutors, readProviderJson } from "../provider-runtime.ts";

const API_BASE = "https://api.precision.dext.com";

async function dextGet<T>(context: ApiKeyProviderContext, path: string): Promise<T> {
  const response = await context.fetcher(`${API_BASE}${path}`, {
    headers: {
      authorization: `Bearer ${context.apiKey}`,
      accept: "application/json",
    },
    signal: context.signal,
  });
  return readProviderJson<T>(response, "Dext");
}

export const executors: ProviderExecutors = defineApiKeyProviderExecutors("dext", {
  list_clients: (_input, context) => dextGet(context, "/clients"),
  get_client_activity: (input, context) =>
    dextGet(context, `/clients/${encodeURIComponent(String(input.clientId))}/activity-stats`),
});
