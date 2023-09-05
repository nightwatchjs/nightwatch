const {Origin} = require('selenium-webdriver');
const Utils = require('../../utils/');
const ProtocolAction = require('./_base-action.js');
const {isNumber, isString} = Utils;

/**
 * Move the mouse by an offset of the specified [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) or relative to the current mouse cursor, if no element is specified. If an element is provided but no offset, the mouse will be moved to the center of the element.
 *
 * If an element is provided but no offset, the mouse will be moved to the center of the element. If the element is not visible, it will be scrolled into view.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.moveTo(null, 110, 100);
 * };
 *
 * @syntax .moveTo([webElementId], xoffset, yoffset, [callback])
 * @syntax .moveTo(null, xoffset, yoffset, [callback])
 * @editline L1335
 * @param {string} [webElementId] The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) assigned to the element to move to. If not specified or is null, the offset is relative to current position of the mouse.
 * @param {number} xoffset X offset to move to, relative to the center of the element. If not specified, the mouse will move to the middle of the element.
 * @param {number} yoffset Y offset to move to, relative to the center of the element. If not specified, the mouse will move to the middle of the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class Command extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(...args) {
    let webElementId;
    let xoffset = 0;
    let yoffset = 0;
    let callback = function() {};

    const lastItem = args[args.length - 1];
    if (Utils.isFunction(lastItem)) {
      args.pop();
      callback = lastItem;
    }

    if (isString(args[0]) || arguments[0] === null) {
      webElementId = args.shift();

      if (webElementId === null) {
        webElementId = Origin.POINTER;
      } else {
        ProtocolAction.validateElementId(webElementId);
      }
    }

    if (args.length === 1 && isNumber(args[0]) && !isNaN(args[0])) {
      xoffset = args[0];
    } else if (args.length === 2 && isNumber(args[0]) && !isNaN(args[0]) && isNumber(args[1]) && !isNaN(args[1])) {
      xoffset = args[0];
      yoffset = args[1];
    } else if (args.length > 2 || (args.length > 0 && (args[0] !== null || args[1] !== null))) {
      throw new Error('Invalid Parameters for moveTo Command');
    }

    if (!webElementId) {
      webElementId = Origin.POINTER;
    }

    return this.transportActions.moveTo(webElementId, xoffset, yoffset, callback);

  }
};
