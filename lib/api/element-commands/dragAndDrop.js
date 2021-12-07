const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Drag an element to the given position or destination element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.dragAndDrop('#main', {x: 100, y:100}):
 *
 *    
 *
 *  //using webElement as a destination
 *   demoTestAsync: async function(browser) {
 *     const destination = await browser.findElement('#upload');
 *     browser.dragAndDrop('#main', destination.getId());
 *   }
 * }
 *
 * @method dragAndDrop
 * @syntax .dragAndDrop(selector, destination, callback)
 * @syntax .dragAndDrop(using, selector, attribute, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} destination webElementId or {x,y} offset.
 * @param {function} callback Callback function which is called with the result value; not required if using `await` operator.
 * @returns {*} null
 */
class DragElement extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'dragElement';
  }
}

module.exports = DragElement;
