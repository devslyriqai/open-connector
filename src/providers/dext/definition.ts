import type { ProviderDefinition } from "../../core/types.ts";

import { dextActions } from "./actions.ts";

const service = "dext";

/**
 * Dext — the read-only Data Health & Insights API (requires a Dext Practice account). NOT OAuth2 — a
 * bearer token created in Practice settings > Data Health > API tokens, sent as Authorization: Bearer.
 * Note: receipt/expense INGESTION is not covered by this API. See help.dext.com.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "Dext",
  categories: ["Productivity"],
  authTypes: ["api_key"],
  auth: [
    {
      type: "api_key",
      label: "API Token",
      placeholder: "DEXT_API_TOKEN",
      description:
        "Dext Practice API token, sent as the Authorization: Bearer header. Practice > Data Health > API tokens.",
    },
  ],
  homepageUrl: "https://dext.com",
  actions: dextActions,
};
