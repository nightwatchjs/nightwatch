/**
 * Clear a textarea or a text input element's value.
 * This command has no effect if the underlying DOM element is neither a text INPUT element nor a TEXTAREA element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('input[type=text]').clear();
 *
 *     browser.element('textarea').clear();
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('input[type=text]').clear();
 *
 *     await browser.element('textarea').clear();
 *   }
 * }
 *
 * @since 3.0.0
 * @method clear
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).clear()
 * @link /#dfn-element-clear
 * @returns {ScopedWebElement}
 */
module.exports.command = function () {
  return this.runQueuedCommand('clearElementValue');
};
