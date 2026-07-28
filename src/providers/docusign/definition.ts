import type { ProviderDefinition } from "../../core/types.ts";

import { docusignActions } from "./actions.ts";
import { docusignOAuthScopes } from "./scopes.ts";

const service = "docusign";

/**
 * DocuSign provider backed by the eSignature REST API and a user-provided DocuSign OAuth app
 * (Authorization Code Grant). The account's REST base URI + accountId are discovered per-connection
 * from /oauth/userinfo — never hardcoded — so the same provider serves demo and production accounts.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "DocuSign",
  categories: ["Productivity"],
  authTypes: ["oauth2"],
  auth: [
    {
      type: "oauth2",
      authorizationUrl: "https://account.docusign.com/oauth/auth",
      tokenUrl: "https://account.docusign.com/oauth/token",
      scopes: docusignOAuthScopes,
      tokenEndpointAuthMethod: "client_secret_basic",
      authorizationParams: {
        response_type: "code",
      },
    },
  ],
  homepageUrl: "https://www.docusign.com",
  actions: docusignActions,
};
