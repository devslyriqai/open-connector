export const xeroSettingsReadScope = "accounting.settings.read";
export const xeroTransactionsReadScope = "accounting.transactions.read";
export const xeroContactsReadScope = "accounting.contacts.read";
export const xeroReportsReadScope = "accounting.reports.read";

// offline_access is required for a refresh token; openid/profile/email identify the user.
export const xeroOAuthScopes: string[] = [
  "openid",
  "profile",
  "email",
  "offline_access",
  xeroSettingsReadScope,
  xeroTransactionsReadScope,
  xeroContactsReadScope,
  xeroReportsReadScope,
];
