/**
 * Sends some text to an element. Can be used to set the value of a form element or to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
 *
 * <div class="alert alert-warning"><strong>setValue</strong> also clears the existing value of the element by calling the <strong>clear()</strong> beforehand.</div>
 *
 * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 * @example
 * // send some simple text to an input
 * this.demoTest = function (browser) {
 *   const result = await browser.element('input[type=text]').setValue('nightwatch');
 * };
 *
 * // send some text to an input and hit enter.
 * this.demoTest = function (browser) {
 *   const result = await browser.element('input[type=text]').setValue(['nightwatch', browser.Keys.ENTER]);
 * };
 *
 *
 * @link /session/:sessionId/element/:id/value
 * @method setValue
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).setValue(inputValue)
 * @param {string|array} inputValue The text to send to the element or key strokes.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link https://www.w3.org/TR/webdriver#element-send-keys
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
