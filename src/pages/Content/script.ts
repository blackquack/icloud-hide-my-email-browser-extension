import { Message, MessageType } from '../../messages';
import './index.css';
import browser from 'webextension-polyfill';

const EMAIL_INPUT_QUERY_STRING =
  'input[type="email"], input[name="email"], input[id="email"]';

type AutofillableInputElement = {
  inputElement: HTMLInputElement;
};

export default async function main(): Promise<void> {
  const emailInputElements = document.querySelectorAll<HTMLInputElement>(
    EMAIL_INPUT_QUERY_STRING
  );

  const makeAutofillableInputElement = (
    inputElement: HTMLInputElement
  ): AutofillableInputElement => ({
    inputElement,
  });

  const autofillableInputElements = Array.from(emailInputElements).map(
    makeAutofillableInputElement
  );

  const mutationCallback: MutationCallback = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) {
          return;
        }

        const addedElements = node.querySelectorAll<HTMLInputElement>(
          EMAIL_INPUT_QUERY_STRING
        );
        addedElements.forEach((el) => {
          const elementExists = autofillableInputElements.some((item) =>
            el.isEqualNode(item.inputElement)
          );
          if (!elementExists) {
            autofillableInputElements.push(makeAutofillableInputElement(el));
          }
        });
      });

      mutation.removedNodes.forEach((node) => {
        if (!(node instanceof Element)) {
          return;
        }

        const removedElements = node.querySelectorAll<HTMLInputElement>(
          EMAIL_INPUT_QUERY_STRING
        );
        removedElements.forEach((el) => {
          const foundIndex = autofillableInputElements.findIndex((item) =>
            el.isEqualNode(item.inputElement)
          );
          if (foundIndex !== -1) {
            autofillableInputElements.splice(foundIndex, 1);
          }
        });
      });
    });
  };

  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, {
    childList: true,
    attributes: false,
    subtree: true,
  });

  browser.runtime.onMessage.addListener((uncastedMessage: unknown) => {
    const message = uncastedMessage as Message<unknown>;

    switch (message.type) {
      case MessageType.Autofill:
        autofillableInputElements.forEach(({ inputElement }) => {
          inputElement.value = message.data as string;
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        });
        break;
      default:
        break;
    }

    return undefined;
  });
}
