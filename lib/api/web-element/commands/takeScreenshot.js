/**
 * Take a screenshot of the visible region encompassed by this element's bounding rectangle.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const screenshot = browser.element('#main').takeScreenshot();
 *     screenshot.then((screenshotData) => {
 *       require('fs/promises').writeFile('out.png', screenshotData, 'base64');
 *     });
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const screenshotData = await browser.element('#main').takeScreenshot();
 *     require('fs/promises').writeFile('out.png', screenshotData, 'base64');
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
  return this.runQueuedCommandScoped('takeElementScreenshot');
};
