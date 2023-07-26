/**
 * Drag an element to the given position or destination element.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('.section').dragAndDrop({ x: 100, y: 100 });
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('.section').dragAndDrop({ x: 0, y: 500 });
 *   }
 * }
 *
 * @since 3.0.0
 * @method dragAndDrop
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).dragAndDrop(coordinates)
 * @returns {ScopedWebElement}
 */
module.exports.command = function(destination) {
  return this.runQueuedCommand('dragElement', {
    args: [destination]
  });
};
