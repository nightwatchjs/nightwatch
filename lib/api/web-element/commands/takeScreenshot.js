/**
 * Take a screenshot of the visible region encompassed by this element's bounding rectangle.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const data = browser.element('#main').takeScreenshot();
 *     require('fs').writeFile('out.png', data, 'base64');
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const data = await browser.element('#main').takeScreenshot();
 *     require('fs').writeFile('out.png', data, 'base64');
 *   }
 * }
 *
 * @since 3.0.0
 * @method takeScreenshot
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).takeScreenshot()
 * @see https://www.w3.org/TR/webdriver#dfn-take-element-screenshot
 * @returns {ScopedValue<string>}
 */
module.exports.command = function() {
  return this.runQueuedCommand('takeElementScreenshot');
};