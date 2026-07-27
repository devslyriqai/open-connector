import type { ProviderExecutors } from "../../core/types.ts";
import type { OAuthProviderContext } from "../provider-runtime.ts";

import {
  defineOAuthProviderExecutors,
  ProviderRequestError,
  readProviderJson,
  setSearchParams,
} from "../provider-runtime.ts";

const API_BASE = "https://api.xero.com/api.xro/2.0";
const CONNECTIONS_URL = "https://api.xero.com/connections";

async function xeroFetch<T>(context: OAuthProviderContext, url: string, tenantId?: string): Promise<T> {
  const headers: Record<string, string> = {
    authorization: `Bearer ${context.accessToken}`,
    accept: "application/json",
  };
  if (tenantId) {
    headers["xero-tenant-id"] = tenantId;
  }
  const response = await context.fetcher(url, { headers, signal: context.signal });
  return readProviderJson<T>(response, "Xero");
}

/**
 * Xero requires an `xero-tenant-id` header identifying WHICH connected organisation to act on. It is
 * not carried in the access token, so resolve it from the connections endpoint.
 */
async function resolveTenantId(context: OAuthProviderContext): Promise<string> {
  const connections = await xeroFetch<Array<{ tenantId?: string }>>(context, CONNECTIONS_URL);
  const first = Array.isArray(connections) ? connections[0] : undefined;
  if (!first?.tenantId) {
    throw new ProviderRequestError(400, "Xero: no connected organisation on this connection.");
  }
  return first.tenantId;
}

async function xeroGet<T>(
  context: OAuthProviderContext,
  path: string,
  query: Record<string, string | undefined> = {},
): Promise<T> {
  const tenantId = await resolveTenantId(context);
  const url = new URL(`${API_BASE}${path}`);
  setSearchParams(url, query);
  return xeroFetch<T>(context, url.toString(), tenantId);
}

export const executors: ProviderExecutors = defineOAuthProviderExecutors("xero", {
  get_organisation: async (_input, context) => {
    const data = await xeroGet<{ Organisations?: unknown[] }>(context, "/Organisation");
    return { organisations: data.Organisations ?? [] };
  },

  list_invoices: async (input, context) => {
    const query: Record<string, string | undefined> = {};
    if (Array.isArray(input.statuses) && input.statuses.length > 0) {
      query.Statuses = (input.statuses as string[]).join(",");
    }
    if (typeof input.page === "number") {
      query.page = String(input.page);
    }
    return xeroGet(context, "/Invoices", query);
  },

  list_contacts: async (input, context) => {
    const query = typeof input.page === "number" ? { page: String(input.page) } : {};
    return xeroGet(context, "/Contacts", query);
  },

  get_profit_and_loss: async (input, context) => {
    return xeroGet(context, "/Reports/ProfitAndLoss", {
      fromDate: typeof input.fromDate === "string" ? input.fromDate : undefined,
      toDate: typeof input.toDate === "string" ? input.toDate : undefined,
    });
  },
});
