/**
 * Returns an element's last child. The child element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('.features-container').getParentElement().then(resultElement => {
 *       console.log('parent element Id:', resultElement.getId());
 *     });
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const resultElement = await browser.element('.features-container').getParentElement();
 *     console.log('parent element Id:', resultElement.getId());
 *   }
 * }
 *
 * @since 3.3.1
 * @method getParentElement
 * @memberof ScopedWebElement
 * @instance
 * @tutorial https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  const createAction = (actions, webElement) => function getLastElementChild() {
    return actions.executeScript(function(element) {
      return element.parentElement;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getParentElement', createAction});

  return this.createScopedElement(node.deferred.promise);
};

