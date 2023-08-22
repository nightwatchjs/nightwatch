/**
 * Set the value of a specified DOM property for the given element.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#login').setProperty('title', 'Hello');
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('#login').setProperty('title', 'Hello');
 *   }
 * }
 *
 * @since 3.0.0
 * @method setProperty
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).setProperty(name, value)
 * @param {string} name The property name to set.
 * @param value The property value name to set.
 * @returns {ScopedWebElement}
 */
module.exports.command = function(name, value) {
  return this.runQueuedCommand('setElementProperty', {
    args: [name, value]
  });
};
