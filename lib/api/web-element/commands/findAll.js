/**
 * Search for elements on the page. The located elements will be returned as a special web element object (with added convenience methods).
 * The argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
 * Elements can be searched by using another element as the starting point.
 *
 * @example
 * export default {
 *   async demoTest(browser: NightwatchAPI): Promise<void> {
 *     const buttonsElement = browser.element.findAll('button.submit-form');
 *
 *     // Get an array of found elements.
 *     const buttons = await buttonsElement;
 *
 *     // Use an object to customise locating behaviour.
 *     const sections = browser.element
 *       .findAll({ selector: 'section', locateStrategy: 'css selector' });
 *   }
 * }
 *
 * @since 3.0.0
 * @method findAll
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findAll(syntax)
 * @param {Selector} selector
 * @returns {Array.<ScopeWebElement>}
 * @alias getAll
 * @alias findElements
 */
module.exports.command = function(selector) {
  return this.createScopedElements(selector, {parentElement: this, commandName: 'findAll'});
};
