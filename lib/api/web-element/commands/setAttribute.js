/**
 * Set the value of a specified DOM attribute for the given element. For all the available DOM attributes, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#login input[type=text]').setAttribute('disabled', true);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('#login input[type=text]').setAttribute('disabled', true);
 *   }
 * }
 *
 * @since 3.0.0
 * @method setAttribute
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).setAttribute(name, value)
 * @param {string} name The attribute name to set.
 * @param value The attribute value name to set.
 * @returns {ScopedWebElement}
 */
module.exports.command = function(name, value) {
  return this.runQueuedCommand('setElementAttribute', {
    args: [name, value]
  });
};
