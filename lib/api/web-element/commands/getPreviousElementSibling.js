/**
 * Returns the element immediately preceding the specified one in its parent's child elements list. The element will be returned as web element JSON object (with an added `.getId()` convenience method).
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('.features-container li:second-child').getPreviousElementSibling().then(resultElement => {
 *       console.log('previous sibling element Id:', resultElement.getId());
 *     });
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const resultElement = await browser.element('.features-container li:second-child').getPreviousElementSibling();
 *     console.log('previous sibling element Id:', resultElement.getId());
 *   }
 * }
 *
 * @since 3.0.0
 * @method getPreviousElementSibling
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getPreviousElementSibling()
 * @tutorial developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  const createAction = (actions, webElement) => function() {
    return actions.executeScript(function(element) {
      return element.previousElementSibling;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getPreviousElementSibling', createAction});

  return this.createScopedElement(node.deferred.promise);
};



