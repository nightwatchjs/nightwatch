const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Move the mouse by an offset of the specified element. If an element is provided but no offset, the mouse will be moved to the center of the element. If the element is not visible, it will be scrolled into view.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.moveToElement('#main', 10, 10);
 * };
 *
 *
 * @method moveToElement
 * @syntax .moveToElement(selector, xoffset, yoffset, [callback])
 * @syntax .moveToElement(using, selector, xoffset, yoffset, [callback])
 * @syntax browser.element(selector).moveTo([x], [y])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {number} xoffset X offset to move to, relative to the center of the element.
 * @param {number} yoffset Y offset to move to, relative to the center of the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @jsonwire
 * @api protocol.elementinteraction
 */
class MoveToElement extends BaseElementCommand {
  get extraArgsCount() {
    return 2;
  }

  get elementProtocolAction() {
    return 'moveTo';
  }
}

module.exports = MoveToElement;
