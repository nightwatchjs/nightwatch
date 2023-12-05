/**
 * Returns the `shadowRoot` read-only property which represents the shadow root hosted by the element. This can further be used to retrieve elements part of the shadow root element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#login').getShadowRoot().then(result => {
 *       console.log('shadowRootEl', result);
 *     });
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#login').getShadowRoot();
 *     console.log('shadowRootEl', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getShadowRoot
 * @memberof ScopedWebElement
 * @instance
 * @tutorial developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  const createAction = (actions, webElement) => function() {
    return actions.getShadowRoot(webElement);
  };
  const node = this.queueAction({name: 'getShadowRoot', createAction});

  return this.createScopedElement(node.deferred.promise);
};
