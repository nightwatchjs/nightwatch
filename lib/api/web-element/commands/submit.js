/**
 * Submits the form containing this element (or this element if it is itself a FORM element). his command is a no-op if the element is not contained in a form.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * <p class="alert alert-warning">This command has been deprecated and is not available when using <a href="https://www.w3.org/TR/webdriver1/">W3C Webdriver</a> clients (such as GeckoDriver). It's only available when using the Selenium <a href="https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol" target="_blank">JSONWire Protocol</a>.</p>
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('form.login').submit();
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('form.login').submit();
 *   }
 * }
 *
 * @since 3.0.0
 * @method submit
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).submit()
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  return this.runQueuedCommand('elementSubmit');
};
