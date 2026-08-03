import browser from 'webextension-polyfill';

export enum MessageType {
  Autofill,
}

export type Message<T> = {
  type: MessageType;
  data: T;
};

export const sendMessageToTab = async (
  type: MessageType,
  data: unknown,
  tab?: browser.Tabs.Tab
): Promise<void> => {
  if (tab === undefined) {
    [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
  }

  if (tab?.id !== undefined) {
    await browser.tabs.sendMessage(tab.id, {
      type,
      data,
    });
  }
};
