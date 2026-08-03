import {
  getBrowserStorageValue,
  setBrowserStorageValue,
  DEFAULT_STORE,
} from '../../storage';
import ICloudClient, {
  DEFAULT_SETUP_URL,
  CN_SETUP_URL,
} from '../../iCloudClient';
import browser from 'webextension-polyfill';
import {
  NOTIFICATION_MESSAGE_COPY,
  NOTIFICATION_TITLE_COPY,
} from './constants';

const constructClient = async (): Promise<ICloudClient> => {
  const clientState = await getBrowserStorageValue('clientState');

  if (clientState === undefined) {
    console.debug('constructClient: Using default setupUrl');
    return new ICloudClient(DEFAULT_SETUP_URL);
  }

  return new ICloudClient(clientState.setupUrl, clientState.webservices);
};

const performDeauthSideEffects = () => {
  setBrowserStorageValue('popupState', DEFAULT_STORE.popupState);
  setBrowserStorageValue('clientState', DEFAULT_STORE.clientState);
};

const performAuthSideEffects = (
  client: ICloudClient,
  options: { notification?: boolean } = {}
) => {
  const { notification = false } = options;

  setBrowserStorageValue('clientState', {
    setupUrl: client.setupUrl,
    webservices: client.webservices,
  });

  if (notification) {
    browser.notifications
      .create({
        type: 'basic',
        title: NOTIFICATION_TITLE_COPY,
        message: NOTIFICATION_MESSAGE_COPY,
        iconUrl: 'icon-128.png',
      })
      .catch(console.debug);
  }
};

// ===== Non-blocking webrequest listeners (used for syncing the authentication state of the user) =====

// The extension needs to be in sync with the icloud.com authentication state of the browser.
// For example, when the user is authenticated we need to render the context menu item
// as enabled.
browser.webRequest.onResponseStarted.addListener(
  async (details: browser.WebRequest.OnResponseStartedDetailsType) => {
    const { statusCode, url } = details;
    if (statusCode < 200 && statusCode > 299) {
      console.debug('Request failed', details);
      return;
    }

    const setupUrl = url.split('/accountLogin')[0] as ICloudClient['setupUrl'];
    const client = new ICloudClient(setupUrl);
    const isAuthenticated = await client.isAuthenticated();
    if (isAuthenticated) {
      performAuthSideEffects(client, { notification: true });
    }
  },
  {
    urls: [
      `${DEFAULT_SETUP_URL}/accountLogin*`,
      `${CN_SETUP_URL}/accountLogin*`,
    ],
  },
  []
);

// When the user signs out of their account through icloud.com, we should
// perform various side effects (e.g. disabling the context menu item)
browser.webRequest.onResponseStarted.addListener(
  async (details: browser.WebRequest.OnResponseStartedDetailsType) => {
    const { statusCode } = details;
    if (statusCode < 200 && statusCode > 299) {
      console.debug('Request failed', details);
      return;
    }

    performDeauthSideEffects();
  },
  {
    urls: [`${DEFAULT_SETUP_URL}/logout*`, `${CN_SETUP_URL}/logout*`],
  },
  []
);

// ===== Post installation hooks =====

// Sync the extension with the authentication state of the browser.
// If the user is already authenticated, they should not need to
// log out and log back in in order to get the extension working.
browser.runtime.onInstalled.addListener(
  async (details: browser.Runtime.OnInstalledDetailsType) => {
    if (['install', 'update'].includes(details.reason)) {
      const client = await constructClient();
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        performAuthSideEffects(client, { notification: true });
      } else {
        performDeauthSideEffects();
      }
    }
  }
);
// Present the user with a getting-started guide.
browser.runtime.onInstalled.addListener(
  async (details: browser.Runtime.OnInstalledDetailsType) => {
    const userguideUrl = browser.runtime.getURL('userguide.html');

    if (details.reason === 'install') {
      browser.tabs.create({ url: userguideUrl }).then(console.debug);
    }
  }
);
