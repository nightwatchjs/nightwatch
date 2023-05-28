const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Drag an element to the given position or destination element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.dragAndDrop('#main', {x: 100, y:100})
 *   }
 *
 *   // using an Element ID as a destination
 *   demoTestAsync: async function(browser) {
 *     const destination = await browser.findElement('#upload');
 *     browser.dragAndDrop('#main', destination.getId());
 *   }
 * }
 *
 * @method dragAndDrop
 * @syntax .dragAndDrop(selector, destination, callback)
 * @syntax .dragAndDrop(using, selector, destination, callback)
 * @syntax browser.element(selector).dragAndDrop(coordinates)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://w3c.github.io/webdriver/#capabilities)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](/guide/using-nightwatch/finding-and-interacting-with-elements.html#element-properties).
 * @param {string} destination Either another element to drag to (will drag to the center of the element), or an {x, y} object specifying the offset to drag by, in pixels.
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
