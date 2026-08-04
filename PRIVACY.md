# Privacy and technical disclosure

This extension is an independent Chromium client for iCloud Hide My Email. It is not endorsed, authorized, maintained, or supported by Apple. It uses iCloud web APIs that are not documented as a public extension API, so Apple may change or disable the behavior at any time.

## Authentication

The extension does not ask for, read, or store an Apple Account password. You sign in directly on iCloud.com. Chrome then attaches its browser-managed iCloud session cookies to the extension's HTTPS requests because the extension has host permission for:

- `https://*.icloud.com/*`
- `https://*.icloud.com.cn/*`

The extension does not use the cookies for requests to any other host and does not copy their values into extension storage.

## Data sent to iCloud

Depending on the action you choose, the extension sends requests to iCloud to:

- validate the current browser session;
- list, generate, reserve, activate, deactivate, or delete Hide My Email addresses;
- update an address label or note;
- change the forwarding address; and
- sign out.

These requests can include a generated Hide My Email address, its iCloud identifier, a label (the current site's hostname by default), a note, a forwarding-address selection, or sign-out options. The extension has no analytics, advertising SDK, or developer-operated backend, and does not send this data to the repository owner.

## Data stored locally

Chrome extension storage contains only:

- popup state, such as whether the UI is signed in; and
- iCloud setup and service endpoint URLs returned by Apple.

Hide My Email records and forwarding addresses fetched from iCloud are held in UI memory while needed and are not persisted by the extension. Signing out clears the stored client state.

## Request header rewriting

The declarative network rules in `src/rules.json` rewrite the `Origin` and `Referer` headers on extension-initiated `XMLHttpRequest` traffic to iCloud:

- requests to `https://*.icloud.com/*` use `https://www.icloud.com`; and
- requests to `https://*.icloud.com.cn/*` use `https://www.icloud.com.cn`.

The rules exclude requests initiated by Apple and iCloud pages themselves. This rewriting makes extension requests resemble requests from the corresponding iCloud web application and is required by the current unofficial integration. It can stop working if Apple changes its API, authentication, CORS, or request-validation behavior.

## Page access

The extension does not inject content scripts into visited pages. The `activeTab` permission is used when you open the popup so the current site's hostname can be proposed as the label for a newly reserved address. The extension does not read the page contents or fill page fields.
