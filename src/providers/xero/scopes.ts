// Xero AU accounting scopes for the AU Tax pack. Uses the NEW GRANULAR scopes (broad scopes like
// accounting.transactions.read / accounting.reports.read are unavailable to apps created after
// 2 March 2026). offline_access is required for a refresh token.
export const xeroSettingsReadScope = "accounting.settings.read";
export const xeroContactsReadScope = "accounting.contacts.read";
export const xeroInvoicesReadScope = "accounting.invoices.read";
export const xeroBankTransactionsReadScope = "accounting.banktransactions.read";
export const xeroReportsProfitAndLossReadScope = "accounting.reports.profitandloss.read";
export const xeroReportsTaxReadScope = "accounting.reports.taxreports.read";

export const xeroOAuthScopes: string[] = [
  "openid",
  "profile",
  "email",
  "offline_access",
  xeroSettingsReadScope,
  xeroContactsReadScope,
  xeroInvoicesReadScope,
  xeroBankTransactionsReadScope,
  xeroReportsProfitAndLossReadScope,
  xeroReportsTaxReadScope,
];
