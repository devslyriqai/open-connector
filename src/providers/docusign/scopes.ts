// DocuSign OAuth scopes. "signature" grants the eSignature REST API; "extended" is required for a
// long-lived refresh token. The account's REST base URI is read from /oauth/userinfo (see executors).
export const docusignSignatureScope = "signature";

export const docusignOAuthScopes: string[] = ["signature", "extended"];
