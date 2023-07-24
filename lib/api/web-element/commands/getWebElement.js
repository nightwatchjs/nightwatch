/**
 * Returns an instance of [Selenium WebElement](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html) for the element.
 *
 * @example
 * export default {
 *   async demoTest(browser: NightwatchAPI): Promise<void> {
 *     const webElement = await browser.element('#login input[type=text]').getWebElement();
 *
 *     // check whether element is visible
 *     const webElementVisible = await webElement.isDisplayed();
 *     if (webElementVisible) {
 *       // do something
 *     }
 *   }
 * }
 *
 * @since 3.0.0
 * @method element.getWebElement
 * @syntax browser.element(selector).getWebElement()
 * @memberof ScopedWebElement
 * @instance
 * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html
 * @returns {WebElement}
 */
module.exports.command = function () {
  return this.webElement;
};
