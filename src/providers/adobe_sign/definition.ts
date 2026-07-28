import type { ProviderDefinition } from "../../core/types.ts";

import { adobeSignActions } from "./actions.ts";
import { adobeSignOAuthScopes } from "./scopes.ts";

const service = "adobe_sign";

/**
 * Adobe Acrobat Sign provider (eSignature REST API v6).
 *
 * ⚠️ Adobe's OAuth hosts are DATA-CENTER (shard) specific. These default to `na1`; a firm whose
 * account lives on another shard (na2 / na3 / eu1 / au1 / jp1 …) must point their OAuth client at the
 * matching `secure.<shard>.adobesign.com` / `api.<shard>.adobesign.com` host. The REST API base is then
 * discovered per-connection at runtime via `GET /api/rest/v6/baseUris` (see executors), so calls always
 * land on the right host regardless of the authorize shard.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "Adobe Acrobat Sign",
  categories: ["Productivity"],
  authTypes: ["oauth2"],
  auth: [
    {
      type: "oauth2",
      authorizationUrl: "https://secure.na1.adobesign.com/public/oauth/v2",
      tokenUrl: "https://api.na1.adobesign.com/oauth/v2/token",
      scopes: adobeSignOAuthScopes,
      tokenEndpointAuthMethod: "client_secret_post",
      authorizationParams: {
        response_type: "code",
      },
    },
  ],
  homepageUrl: "https://www.adobe.com/sign.html",
  actions: adobeSignActions,
};
