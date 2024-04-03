/**
 * Retrieve the value of a specified DOM property for the given element. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @tsexample
 * import { NightwatchBrowser } from 'nightwatch';
 *
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const result = browser.element('#login input[type=text]').getProperty('classList');
 *     console.log('classList', result);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#login input[type=text]').getProperty('classList');
 *     console.log('classList', result);
 *   }
 * }
 *
 * @example
 * export default {
 *   demoTest(browser) {
 *     const result = browser.element('#login input[type=text]').getProperty('classList');
 *     console.log('classList', result);
 *   },
 *
 *   async demoTestAsync(browser) {
 *     const result = await browser.element('#login input[type=text]').getProperty('classList');
 *     console.log('classList', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getProperty
 * @memberof ScopedWebElement
 * @param {string} name element property
 * @instance
 * @syntax browser.element(selector).getProperty(name)
 * @link /#get-element-property
 * @returns {ScopedValue<string>}
 */
module.exports.command = function (name) {
  return this.runQueuedCommandScoped('getElementProperty', name);
};
