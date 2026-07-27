import type { ProviderDefinition } from "../../core/types.ts";

import { xeroActions } from "./actions.ts";
import { xeroOAuthScopes } from "./scopes.ts";

const service = "xero";

/**
 * Xero provider backed by the Xero Accounting API and a user-provided Xero OAuth app.
 * Scoped for the AU Tax pack: organisation, invoices, contacts, and Profit & Loss.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "Xero",
  categories: ["Accounting"],
  authTypes: ["oauth2"],
  auth: [
    {
      type: "oauth2",
      authorizationUrl: "https://login.xero.com/identity/connect/authorize",
      tokenUrl: "https://identity.xero.com/connect/token",
      scopes: xeroOAuthScopes,
      tokenEndpointAuthMethod: "client_secret_post",
      authorizationParams: {
        response_type: "code",
      },
    },
  ],
  homepageUrl: "https://www.xero.com",
  actions: xeroActions,
};
