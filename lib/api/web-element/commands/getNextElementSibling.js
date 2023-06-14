/**
 * Returns the element immediately following the specified one in their parent's childNodes. The element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('.features-container li:first-child').getNextElementSibling().then(resultElement => {
 *       console.log('next sibling element Id:', resultElement.getId());
 *     });
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const resultElement = await browser.element('.features-container li:first-child').getNextElementSibling();
 *     console.log('next sibling element Id:', resultElement.getId());
 *   }
 * }
 *
 * @since 3.0.0
 * @method getNextElementSibling
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getNextElementSibling()
 * @tutorial developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  const createAction = (actions, webElement) => function() {
    return actions.executeScript(function(element) {
      return element.nextElementSibling;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getNextElementSibling', createAction});

  return this.createScopedElement(node.deferred.promise);
};



