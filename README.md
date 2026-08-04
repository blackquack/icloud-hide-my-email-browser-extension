# iCloud Hide My Email Browser Extension

[![Tests Status](https://github.com/dedoussis/icloud-hide-my-email-browser-extension/workflows/tests/badge.svg)](https://github.com/dedoussis/icloud-hide-my-email-browser-extension/actions/workflows/tests.yml)

[Hide My Email](https://support.apple.com/en-us/HT210425) is a premium privacy service of iCloud. Safari offers a native integration with Hide My Email, whereby users are prompted to generate a Hide My Email address upon registration to any website. This extension brings a similar UX to Chromium-based browsers. It has been tested on:

- [Chrome](https://chrome.google.com/webstore/detail/icloud-hide-my-email/omiaekblhgfopjkjnenhahfgcgnbohlk)
- [Brave](https://chrome.google.com/webstore/detail/icloud-hide-my-email/omiaekblhgfopjkjnenhahfgcgnbohlk)
- Microsoft Edge

Note that the extension _should_ work on any browser that implements the [extension API](https://developer.chrome.com/docs/extensions/reference/) supported by Chromium-based browsers.

_Disclaimer: This extension is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Apple._

See [Privacy and technical disclosure](PRIVACY.md) for details about authentication, stored data, iCloud requests, permissions, and header rewriting.

<p align="center">
<img src="./src/assets/img/demo-popup.gif" alt="Extension popup demo" width="400" height="auto"/>
</p>

<p align="center">
<img src="./src/assets/img/demo-content.gif" alt="Extension content demo" width="600" height="auto"/>
</p>

## Features

- Simple pop-up UI for generating and reserving new Hide My Email addresses
- Ability to manage existing Hide My Email addresses (including deactivation, reactivation, and deletion)
- Quick configuration of Hide My Email settings, such as the Forward-To address, through the Options page of the extension

## Develop

This extension is entirely written in TypeScript. The UI pages of the extension (e.g. Pop-Up and Options) are implemented as React apps and styled with TailwindCSS.

### Dev environment

Development was carried out in an environment that matches the following Docker image:

```Dockerfile
FROM node:25.1.0-alpine3.22

RUN apk add --update --no-cache g++ make python3

ADD . /opt/extension

WORKDIR /opt/extension

ENTRYPOINT ["sh"]
```

### Development workflow

The table below outlines the sequence of steps needed to ship a change.

Note: the following console commands are to be executed from the root directory of this repo

<!-- prettier-ignore-start -->
| # | Description | Command or action |
| - | - | - |
| 0 | Configure Node environment (not required when building with Docker) | `nvm use` |
| 1 | Install dependencies | `npm ci` |
| 2 | Start the development server, which generates the `build` directory | `npm run start` |
| 3 | Load the unpacked extension | Load `build` through the browser's extension UI. See the [Google Chrome guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked). |
| 4 | Build the production artifact | `npm run build` |
| 5 | Compress the production artifact | `zip build.zip ./build/*` |
| 6 | Publish | [Chrome Web Store developer console](https://chrome.google.com/webstore/devconsole/) |
<!-- prettier-ignore-end -->

### TODOs

- [ ] Ability to modify the label and note of existing HME addresses
- [ ] CI and maybe CD
- [ ] Dependabot
