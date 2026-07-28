import type { ActionDefinition } from "../../core/types.ts";

import { s } from "../../core/json-schema.ts";
import { defineProviderAction } from "../../core/provider-definition.ts";

const service = "karbon";

const karbonObject = s.record(true, { description: "Karbon API object." });

export const karbonActions: ActionDefinition[] = [
  defineProviderAction(service, {
    name: "list_contacts",
    description: "List client contacts (people) in the practice.",
    inputSchema: s.object(
      { filter: s.string({ description: "Optional OData $filter expression." }) },
      { description: "Contact filters (all optional)." },
    ),
    outputSchema: karbonObject,
  }),

  defineProviderAction(service, {
    name: "list_organizations",
    description: "List client organizations in the practice.",
    inputSchema: s.object(
      { filter: s.string({ description: "Optional OData $filter expression." }) },
      { description: "Organization filters (all optional)." },
    ),
    outputSchema: karbonObject,
  }),

  defineProviderAction(service, {
    name: "get_work_item",
    description: "Get a work item (job / engagement) by its key.",
    inputSchema: s.object(
      { key: s.string({ minLength: 1, description: "The WorkItem key." }) },
      { required: ["key"], description: "Work item selector." },
    ),
    outputSchema: karbonObject,
  }),
];
