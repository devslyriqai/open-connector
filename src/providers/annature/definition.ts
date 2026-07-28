import type { ProviderDefinition } from "../../core/types.ts";

import { annatureActions } from "./actions.ts";

const service = "annature";

/**
 * Annature (AU e-signing). NOT OAuth2 — a public/private key pair sent as two headers on every request:
 * `X-Annature-Id` (public key) and `X-Annature-Key` (private key). Keys are generated in-app at
 * dashboard.annature.com.au/developers. See docs.annature.com.au.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "Annature",
  categories: ["Productivity"],
  authTypes: ["api_key"],
  auth: [
    {
      type: "api_key",
      label: "Private Key",
      placeholder: "ANNATURE_PRIVATE_KEY",
      description: "Annature private key, sent as the X-Annature-Key header.",
      extraFields: [
        {
          key: "publicKey",
          label: "Public Key",
          inputType: "text",
          required: true,
          secret: false,
          placeholder: "ANNATURE_PUBLIC_KEY",
          description: "Annature public key, sent as the X-Annature-Id header.",
        },
      ],
    },
  ],
  homepageUrl: "https://annature.com.au",
  actions: annatureActions,
};
