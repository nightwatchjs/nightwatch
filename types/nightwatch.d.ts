import { NightwatchCallbackResult } from './index';

type ScrollBehavior = 'auto' | 'smooth';

interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
}

interface ScrollToOptions extends ScrollOptions {
  left?: number;
  top?: number;
}

interface NightwatchBrowser {
  /**
   * Scrolls to a particular set of coordinates in the document.
   *
   * @param x - The pixel along the horizontal axis of the document that you want displayed in the upper left.
   * @param y - The pixel along the vertical axis of the document that you want displayed in the upper left.
   * @param options - The scroll options.
   * @param callback - Optional callback function to be called when the command finishes.
   * @returns The instance of the Nightwatch browser object.
   */
  scrollTo(x: number, y: number, options?: ScrollToOptions, callback?: (result: NightwatchCallbackResult<null>) => void): this;
  scrollTo(options: ScrollToOptions, callback?: (result: NightwatchCallbackResult<null>) => void): this;

  /**
   * Scrolls an element into view.
   *
   * @param selector - The selector for the element to scroll into view.
   * @param options - The scroll options.
   * @param callback - Optional callback function to be called when the command finishes.
   * @returns The instance of the Nightwatch browser object.
   */
  scrollIntoView(selector: string, options?: ScrollOptions, callback?: (result: NightwatchCallbackResult<null>) => void): this;

  /**
   * Scrolls to the bottom of the document.
   *
   * @param options - The scroll options.
   * @param callback - Optional callback function to be called when the command finishes.
   * @returns The instance of the Nightwatch browser object.
   */
  scrollToBottom(options?: ScrollOptions, callback?: (result: NightwatchCallbackResult<null>) => void): this;

  /**
   * Scrolls to the top of the document.
   *
   * @param options - The scroll options.
   * @param callback - Optional callback function to be called when the command finishes.
   * @returns The instance of the Nightwatch browser object.
   */
  scrollToTop(options?: ScrollOptions, callback?: (result: NightwatchCallbackResult<null>) => void): this;
} 