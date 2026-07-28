import type { ProviderDefinition } from "../../core/types.ts";

import { karbonActions } from "./actions.ts";

const service = "karbon";

/**
 * Karbon (practice management). NOT OAuth2 — a two-key scheme: an Application Access Key (Bearer) plus
 * the firm's tenant Access Key (the `AccessKey` header). Register a free Karbon developer app, have the
 * firm connect it, then read the Access Key under Settings > Connected Apps. See developers.karbonhq.com.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "Karbon",
  categories: ["Productivity"],
  authTypes: ["api_key"],
  auth: [
    {
      type: "api_key",
      label: "Application Access Key",
      placeholder: "KARBON_APPLICATION_ACCESS_KEY",
      description:
        "Karbon Application Access Key, sent as the Authorization: Bearer header. From your Karbon developer app.",
      extraFields: [
        {
          key: "tenantKey",
          label: "Access Key",
          inputType: "text",
          required: true,
          secret: true,
          placeholder: "KARBON_ACCESS_KEY",
          description:
            "The firm's tenant Access Key, sent as the AccessKey header. Karbon > Settings > Connected Apps > Manage.",
        },
      ],
    },
  ],
  homepageUrl: "https://karbonhq.com",
  actions: karbonActions,
};
