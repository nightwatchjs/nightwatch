/**
 * Move to the element and peforms a double-click in the middle of the element.
 *
 * <p class="alert alert-info">The command <code>doubleClick()</code> will automatically wait for the element to be present (until the specified timeout). If the element is not found, an error is thrown which will cause the test to fail. You can suppress element not found errors by specifying the <code>selector</code> argument as an object and passing the <code>suppressNotFoundErrors = true</code> option.</p>
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('button.submit-form').doubleClick();
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('button.submit-form').doubleClick();
 *   }
 * }
 *
 * @since 3.0.0
 * @method doubleClick
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).doubleClick()
 * @see https://www.selenium.dev/documentation/webdriver/actions_api/mouse/#double-click
 * @returns {ScopedWebElement}
 */
module.exports.command = function () {
  return this.runQueuedCommand('doubleClick');
};
