import { NightwatchAPI } from 'nightwatch';

declare module 'nightwatch' {
  export interface NightwatchCustomCommands {
    /**
     * Scrolls the page to the bottom. Works for both web and native apps.
     */
    scrollToBottom(): NightwatchAPI;

    /**
     * Scrolls the page to the top. Works for both web and native apps.
     */
    scrollToTop(): NightwatchAPI;

    /**
     * Scrolls an element into view. Works for both web and native apps.
     * @param {string} selector - The CSS/XPath selector used to locate the element.
     * @param {string} [using] - The locator strategy to use.
     */
    scrollIntoView(selector: string, using?: string): NightwatchAPI;

    /**
     * Scrolls the page until the specified text is visible. Works for both web and native apps.
     * @param {string} text - The text to scroll until visible.
     */
    scrollUntilText(text: string): NightwatchAPI;
  }
} 