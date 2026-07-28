import type { ActionDefinition } from "../../core/types.ts";

import { s } from "../../core/json-schema.ts";
import { defineProviderAction } from "../../core/provider-definition.ts";

const service = "annature";

const annatureObject = s.record(true, { description: "Annature API object." });

export const annatureActions: ActionDefinition[] = [
  defineProviderAction(service, {
    name: "list_envelopes",
    description: "List signing envelopes and their status.",
    inputSchema: s.object({}, { description: "No input." }),
    outputSchema: annatureObject,
  }),

  defineProviderAction(service, {
    name: "get_envelope",
    description: "Get one envelope's status (sent / viewed / completed).",
    inputSchema: s.object(
      { id: s.string({ minLength: 1, description: "The envelope id." }) },
      { required: ["id"], description: "Envelope selector." },
    ),
    outputSchema: annatureObject,
  }),
];
