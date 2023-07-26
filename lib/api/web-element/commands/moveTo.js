/**
 * Move the mouse by an offset of the specified element. If an element is provided but no offset, the mouse will be moved to the center of the element. If the element is not visible, it will be scrolled into view.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * <p class="alert alert-warning">This command has been deprecated and is not available when using <a href="https://www.w3.org/TR/webdriver1/">W3C Webdriver</a> clients (such as GeckoDriver). It's only available when using the Selenium <a href="https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol" target="_blank">JSONWire Protocol</a>.</p>
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#main').moveTo(10, 10);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('#main').moveTo(10, 10);
 *   }
 * }
 *
 * @since 3.0.0
 * @method moveTo
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).moveTo([x], [y])
 * @param {number} [x=0] X offset to move to, relative to the center of the element.
 * @param {number} [y=0] Y offset to move to, relative to the center of the element
 * @returns {ScopedWebElement}
 */
module.exports.command = function(x = 0, y = 0) {
  return this.runQueuedCommand('moveTo', {
    args: [x, y]
  });
};
