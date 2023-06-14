/**
 * Inspect element in DevTools.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const lastElement = browser.element('#nestedt').getLastElementChild().inspectInDevTools('lastChild');
 *     console.log('last element:', lastElement);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const lastElement = await browser.element('#nestedt').getLastElementChild().inspectInDevTools('lastChild');
 *     console.log('last element:', lastElement);
 *   }
 * }
 *
 * @since 3.0.0
 * @method inspectInDevTools
 * @memberof ScopedWebElement
 * @param {string} txt
 * @instance
 * @returns {ScopedWebElement}
 */
module.exports.command = function(txt) {
  return this.runQueuedCommand('inspectInDevTools', {args: [txt]});
};
