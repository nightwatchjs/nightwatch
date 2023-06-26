/**
 * Sends some text to an element. Can be used to set the value of a form element or to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
 *
 * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('input[type=text]').update('nightwatch', browser.Keys.ENTER);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('input[type=text]').update('nightwatch', browser.Keys.ENTER);
 *   }
 * }
 *
 * @since 3.0.0
 * @method update
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).update(characters, ...keys)
 * @param {...string} keys
 * @see https://www.w3.org/TR/webdriver#element-send-keys
 * @returns {ScopedWebElement}
 */
module.exports.command = function(...args) {
  const keys = args.reduce((prev, key) => {
    const keyList = Array.isArray(key) ? key : [key];
    prev.push(...keyList);

    return prev;
  }, []);

  return this.runQueuedCommand('setElementValue', {
    args: [keys]
  });
};
