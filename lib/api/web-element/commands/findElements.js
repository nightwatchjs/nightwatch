/**
 * Search for elements on the page. The located elements will be returned as a special web element object (with added convenience methods).
 * The argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
 * Elements can be searched by using another element as the starting point.
 *
 * @example
 * export default {
 *   async demoTest(browser: NightwatchAPI): Promise<void> {
 *     const buttonsElement = browser.element.findElements('button.submit-form');
 *
 *     // Get an array of found elements.
 *     const buttons = await buttonsElement;
 *
 *     // Use an object to customise locating behaviour.
 *     const sections = browser.element
 *       .findElements({ selector: 'section', locateStrategy: 'css selector' });
 *   }
 * }
 *
 * @since 3.0.0
 * @method findElements
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findElements(syntax)
 * @param {Selector} selector
 * @returns {Array.<ScopeWebElement>}
 */
module.exports.command = function(selector) {
  return this.createScopedElements(selector, {parentElement: this, commandName: 'findElements'});
};
