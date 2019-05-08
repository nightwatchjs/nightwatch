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
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {number} xoffset X offset to move to, relative to the top-left corner of the element.
 * @param {number} yoffset Y offset to move to, relative to the top-left corner of the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see moveTo
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
