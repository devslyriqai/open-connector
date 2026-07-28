import type { ActionDefinition } from "../../core/types.ts";

import { s } from "../../core/json-schema.ts";
import { defineProviderAction } from "../../core/provider-definition.ts";
import { docusignSignatureScope } from "./scopes.ts";

const service = "docusign";

const docusignObject = s.record(true, { description: "DocuSign API object." });

export const docusignActions: ActionDefinition[] = [
  defineProviderAction(service, {
    name: "list_envelopes",
    description: "List envelopes (with status) changed on or after a date.",
    requiredScopes: [docusignSignatureScope],
    inputSchema: s.object(
      {
        from_date: s.string({
          minLength: 1,
          description: "Only include envelopes changed on/after this date, YYYY-MM-DD.",
        }),
      },
      { required: ["from_date"], description: "Envelope query." },
    ),
    outputSchema: s.object(
      { envelopes: s.array(docusignObject, { description: "DocuSign Envelope records." }) },
      { description: "Envelopes list response." },
    ),
  }),

  defineProviderAction(service, {
    name: "get_envelope",
    description: "Get one envelope's status and details.",
    requiredScopes: [docusignSignatureScope],
    inputSchema: s.object(
      { envelopeId: s.string({ minLength: 1, description: "The envelope id." }) },
      { required: ["envelopeId"], description: "Envelope selector." },
    ),
    outputSchema: docusignObject,
  }),

  defineProviderAction(service, {
    name: "list_documents",
    description: "List the documents in an envelope (to locate signed copies for download).",
    requiredScopes: [docusignSignatureScope],
    inputSchema: s.object(
      { envelopeId: s.string({ minLength: 1, description: "The envelope id." }) },
      { required: ["envelopeId"], description: "Envelope selector." },
    ),
    outputSchema: s.object(
      { envelopeDocuments: s.array(docusignObject, { description: "Envelope document records." }) },
      { description: "Envelope documents response." },
    ),
  }),
];
