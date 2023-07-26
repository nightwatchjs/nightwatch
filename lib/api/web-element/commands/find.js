/**
 * Search for an element on the page. The located element will be returned as a special web element object (with added convenience methods).
 * The argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
 * Elements can be searched by using another element as the starting point.
 * If many elements match the locating criteria, only first one is returned.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Using element function (alias for find).
 *     const button1 = browser.element('button.submit-form');
 *     // Using the find method of the element namespace.
 *     const button2 = browser.element.find('button.submit-form');
 *     // Searching for the icon element inside the .submit-form button.
 *     const icon = button2.find('i');
 *
 *     // Use an object to customise locating behaviour.
 *     const main = browser.element({ selector: 'main', locateStrategy: 'css selector' });
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     // button is the WebElement object.
 *     const button = await browser.element('button.submit-form');
 *   }
 * }
 *
 * @since 3.0.0
 * @method find
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.find(selector)
 * @param {String|Object} selector
 * @returns {ScopedWebElement}
 */
module.exports.command = function(selector) {
  return this.createScopedElement(selector, this);
};

