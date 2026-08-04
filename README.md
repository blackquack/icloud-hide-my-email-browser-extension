# iCloud Hide My Email Browser Extension

[Hide My Email](https://support.apple.com/en-us/HT210425) is a premium privacy service of iCloud. This Chromium extension provides an interface for generating and managing Hide My Email addresses.

The extension has been tested only against Google Chrome. Other Chromium-based browsers may work but are not tested or supported.

_Disclaimer: This extension is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Apple._

See [Privacy and technical disclosure](PRIVACY.md) for details about authentication, stored data, iCloud requests, permissions, and header rewriting.

<p align="center">
<img src="./src/assets/img/demo-popup.gif" alt="Extension popup demo" width="400" height="auto"/>
</p>

## Features

- Simple pop-up UI for generating and reserving new Hide My Email addresses
- Ability to manage existing Hide My Email addresses (including deactivation, reactivation, and deletion)
- Quick configuration of Hide My Email settings, such as the Forward-To address, through the Options page of the extension

## Develop

This extension is entirely written in TypeScript. The UI pages of the extension (e.g. Pop-Up and Options) are implemented as React apps and styled with TailwindCSS.

### Development workflow

The table below outlines the sequence of steps needed to ship a change.

Note: the following console commands are to be executed from the root directory of this repo

<!-- prettier-ignore-start -->
| # | Description | Command or action |
| - | - | - |
| 0 | Use the Node version pinned in `.nvmrc` | `nvm use` |
| 1 | Install dependencies | `npm ci` |
| 2 | Start the development server, which generates the `build` directory | `npm run start` |
| 3 | Load the unpacked extension | Load `build` through the browser's extension UI. See the [Google Chrome guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked). |
| 4 | Build the production artifact | `npm run build` |
| 5 | Compress the production artifact | `zip build.zip ./build/*` |
| 6 | Publish | [Chrome Web Store developer console](https://chrome.google.com/webstore/devconsole/) |
<!-- prettier-ignore-end -->
