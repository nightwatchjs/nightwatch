/**
 * Drag an element to the given position or destination element.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element.find('.section').dragAndDrop({ x: 100, y: 100 });
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     // using destination coordinates
 *     browser.element.find('.section').dragAndDrop({ x: 0, y: 500 });
 *
 *     // using WebElement of destination
 *     const destWebElement = await browser.element.find('.dest-section');
 *     browser.element.find('.section').dragAndDrop(destWebElement);
 *   }
 * }
 *
 * @since 3.0.0
 * @method dragAndDrop
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).dragAndDrop({x, y})
 * @syntax browser.element(selector).dragAndDrop(<WebElement>)
 * @returns {ScopedWebElement}
 */
module.exports.command = function(destination) {
  return this.runQueuedCommand('dragElement', {
    args: [destination]
  });
};
