import type { ActionDefinition } from "../../core/types.ts";

import { s } from "../../core/json-schema.ts";
import { defineProviderAction } from "../../core/provider-definition.ts";
import {
  xeroContactsReadScope,
  xeroInvoicesReadScope,
  xeroReportsProfitAndLossReadScope,
  xeroSettingsReadScope,
} from "./scopes.ts";

const service = "xero";

const xeroObject = s.record(true, { description: "Xero API object." });
const page = s.integer({ minimum: 1, description: "1-based page number." });

export const xeroActions: ActionDefinition[] = [
  defineProviderAction(service, {
    name: "get_organisation",
    description: "Get the connected Xero organisation(s) — name, base currency, financial year end.",
    requiredScopes: [xeroSettingsReadScope],
    inputSchema: s.object({}, { description: "No input." }),
    outputSchema: s.object(
      { organisations: s.array(xeroObject, { description: "Xero Organisation records." }) },
      { required: ["organisations"], description: "Organisation list." },
    ),
  }),

  defineProviderAction(service, {
    name: "list_invoices",
    description: "List invoices, optionally filtered by status.",
    requiredScopes: [xeroInvoicesReadScope],
    inputSchema: s.object(
      {
        statuses: s.array(s.string({ description: "Invoice status, e.g. AUTHORISED, PAID, DRAFT." }), {
          description: "Invoice statuses to include.",
        }),
        page,
      },
      { description: "Invoice filters (all optional)." },
    ),
    outputSchema: s.object(
      { Invoices: s.array(xeroObject, { description: "Xero Invoice records." }) },
      { required: ["Invoices"], description: "Invoices." },
    ),
  }),

  defineProviderAction(service, {
    name: "list_contacts",
    description: "List contacts (clients / suppliers) in the connected organisation.",
    requiredScopes: [xeroContactsReadScope],
    inputSchema: s.object({ page }, { description: "Contact filters (all optional)." }),
    outputSchema: s.object(
      { Contacts: s.array(xeroObject, { description: "Xero Contact records." }) },
      { required: ["Contacts"], description: "Contacts." },
    ),
  }),

  defineProviderAction(service, {
    name: "get_profit_and_loss",
    description: "Profit & Loss report for a date range (input to the BAS reconciliation dashboard).",
    requiredScopes: [xeroReportsProfitAndLossReadScope],
    inputSchema: s.object(
      {
        fromDate: s.string({ minLength: 1, description: "Report start date, YYYY-MM-DD." }),
        toDate: s.string({ minLength: 1, description: "Report end date, YYYY-MM-DD." }),
      },
      { required: ["fromDate", "toDate"], description: "Profit & Loss date range." },
    ),
    outputSchema: s.object(
      { Reports: s.array(xeroObject, { description: "Xero Report records." }) },
      { required: ["Reports"], description: "Reports." },
    ),
  }),
];
