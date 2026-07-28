import type { ActionDefinition } from "../../core/types.ts";

import { s } from "../../core/json-schema.ts";
import { defineProviderAction } from "../../core/provider-definition.ts";

const service = "dext";

const dextObject = s.record(true, { description: "Dext API object." });

export const dextActions: ActionDefinition[] = [
  defineProviderAction(service, {
    name: "list_clients",
    description: "List client accounts in the practice.",
    inputSchema: s.object({}, { description: "No input." }),
    outputSchema: dextObject,
  }),

  defineProviderAction(service, {
    name: "get_client_activity",
    description: "Get a client's data-health / activity statistics.",
    inputSchema: s.object(
      { clientId: s.string({ minLength: 1, description: "The client id." }) },
      { required: ["clientId"], description: "Client selector." },
    ),
    outputSchema: dextObject,
  }),
];
