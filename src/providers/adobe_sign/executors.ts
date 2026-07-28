import type { ProviderExecutors } from "../../core/types.ts";
import type { OAuthProviderContext } from "../provider-runtime.ts";

import {
  defineOAuthProviderExecutors,
  ProviderRequestError,
  readProviderJson,
} from "../provider-runtime.ts";

// baseUris is called on the account's shard; na1 is the default entry point and returns the account's
// real apiAccessPoint (which may be a different shard). We cache nothing — resolve per call, like Xero.
const BASE_URIS_URL = "https://api.na1.adobesign.com/api/rest/v6/baseUris";

async function adobeFetch<T>(context: OAuthProviderContext, url: string): Promise<T> {
  const response = await context.fetcher(url, {
    headers: {
      authorization: `Bearer ${context.accessToken}`,
      accept: "application/json",
    },
    signal: context.signal,
  });
  return readProviderJson<T>(response, "Adobe Sign");
}

async function resolveApiBase(context: OAuthProviderContext): Promise<string> {
  const info = await adobeFetch<{ apiAccessPoint?: string }>(context, BASE_URIS_URL);
  if (!info.apiAccessPoint) {
    throw new ProviderRequestError(400, "Adobe Sign: no apiAccessPoint returned for this connection.");
  }
  return `${info.apiAccessPoint.replace(/\/$/, "")}/api/rest/v6`;
}

async function adobeGet<T>(context: OAuthProviderContext, path: string): Promise<T> {
  const apiBase = await resolveApiBase(context);
  return adobeFetch<T>(context, `${apiBase}${path}`);
}

export const executors: ProviderExecutors = defineOAuthProviderExecutors("adobe_sign", {
  list_agreements: async (_input, context) => {
    return adobeGet(context, "/agreements");
  },

  get_agreement: async (input, context) => {
    return adobeGet(context, `/agreements/${encodeURIComponent(String(input.agreementId))}`);
  },
});
