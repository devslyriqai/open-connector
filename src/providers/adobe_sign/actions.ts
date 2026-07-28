import type { ActionDefinition } from "../../core/types.ts";

import { s } from "../../core/json-schema.ts";
import { defineProviderAction } from "../../core/provider-definition.ts";
import { adobeSignAgreementReadScope } from "./scopes.ts";

const service = "adobe_sign";

const adobeObject = s.record(true, { description: "Adobe Sign API object." });

export const adobeSignActions: ActionDefinition[] = [
  defineProviderAction(service, {
    name: "list_agreements",
    description: "List agreements (with status) the user has access to.",
    requiredScopes: [adobeSignAgreementReadScope],
    inputSchema: s.object({}, { description: "No input." }),
    outputSchema: s.object(
      { userAgreementList: s.array(adobeObject, { description: "Agreement records." }) },
      { description: "Agreements list response." },
    ),
  }),

  defineProviderAction(service, {
    name: "get_agreement",
    description: "Get one agreement's status and details.",
    requiredScopes: [adobeSignAgreementReadScope],
    inputSchema: s.object(
      { agreementId: s.string({ minLength: 1, description: "The agreement id." }) },
      { required: ["agreementId"], description: "Agreement selector." },
    ),
    outputSchema: adobeObject,
  }),
];
