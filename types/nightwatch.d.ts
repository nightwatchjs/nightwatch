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

interface AndroidScrollOptions {
  /**
   * The strategy to use for scrolling. Can be one of:
   * - 'accessibility id': Scroll to an element with the specified accessibility ID
   * - 'id': Scroll to an element with the specified ID
   * - 'xpath': Scroll to an element matching the XPath expression
   * - 'class name': Scroll to an element with the specified class name
   * - 'text': Scroll to an element containing the specified text
   */
  strategy?: 'accessibility id' | 'id' | 'xpath' | 'class name' | 'text';
  /**
   * The selector to use for finding the element to scroll to
   */
  selector?: string;
  /**
   * The direction to scroll. Can be one of:
   * - 'up': Scroll up
   * - 'down': Scroll down
   * - 'left': Scroll left
   * - 'right': Scroll right
   */
  direction?: 'up' | 'down' | 'left' | 'right';
  /**
   * The percentage of the screen to scroll (0-100)
   */
  percent?: number;
  /**
   * The number of times to perform the scroll
   */
  count?: number;
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

  /**
   * Scrolls in the specified direction on an Android device.
   * This is an Appium-specific command that works with Android native apps.
   *
   * @param options - The scroll options for Android.
   * @param callback - Optional callback function to be called when the command finishes.
   * @returns The instance of the Nightwatch browser object.
   */
  androidScroll(options: AndroidScrollOptions, callback?: (result: NightwatchCallbackResult<null>) => void): this;

  /**
   * Scrolls to an element on an Android device.
   * This is an Appium-specific command that works with Android native apps.
   *
   * @param strategy - The strategy to use for finding the element.
   * @param selector - The selector to use for finding the element.
   * @param callback - Optional callback function to be called when the command finishes.
   * @returns The instance of the Nightwatch browser object.
   */
  androidScrollToElement(strategy: AndroidScrollOptions['strategy'], selector: string, callback?: (result: NightwatchCallbackResult<null>) => void): this;
} 