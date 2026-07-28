import type { ProviderExecutors } from "../../core/types.ts";
import type { OAuthProviderContext } from "../provider-runtime.ts";

import {
  defineOAuthProviderExecutors,
  ProviderRequestError,
  readProviderJson,
  setSearchParams,
} from "../provider-runtime.ts";

const USERINFO_URL = "https://account.docusign.com/oauth/userinfo";

async function docusignFetch<T>(context: OAuthProviderContext, url: string): Promise<T> {
  const response = await context.fetcher(url, {
    headers: {
      authorization: `Bearer ${context.accessToken}`,
      accept: "application/json",
    },
    signal: context.signal,
  });
  return readProviderJson<T>(response, "DocuSign");
}

/**
 * DocuSign's REST base URI and accountId are NOT carried in the access token — resolve them per
 * connection from /oauth/userinfo. This also makes demo vs production hosts self-selecting (the
 * base_uri returned already points at the right data center).
 */
async function resolveApiBase(context: OAuthProviderContext): Promise<string> {
  const info = await docusignFetch<{
    accounts?: Array<{ account_id?: string; base_uri?: string; is_default?: boolean }>;
  }>(context, USERINFO_URL);
  const accounts = Array.isArray(info.accounts) ? info.accounts : [];
  const account = accounts.find((entry) => entry.is_default) ?? accounts[0];
  if (!account?.base_uri || !account.account_id) {
    throw new ProviderRequestError(400, "DocuSign: no account on this connection.");
  }
  return `${account.base_uri}/restapi/v2.1/accounts/${account.account_id}`;
}

async function docusignGet<T>(
  context: OAuthProviderContext,
  path: string,
  query: Record<string, string | undefined> = {},
): Promise<T> {
  const apiBase = await resolveApiBase(context);
  const url = new URL(`${apiBase}${path}`);
  setSearchParams(url, query);
  return docusignFetch<T>(context, url.toString());
}

export const executors: ProviderExecutors = defineOAuthProviderExecutors("docusign", {
  list_envelopes: async (input, context) => {
    return docusignGet(context, "/envelopes", {
      from_date: typeof input.from_date === "string" ? input.from_date : undefined,
    });
  },

  get_envelope: async (input, context) => {
    return docusignGet(context, `/envelopes/${encodeURIComponent(String(input.envelopeId))}`);
  },

  list_documents: async (input, context) => {
    return docusignGet(context, `/envelopes/${encodeURIComponent(String(input.envelopeId))}/documents`);
  },
});
