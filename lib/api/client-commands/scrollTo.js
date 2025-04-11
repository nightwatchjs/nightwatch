/* eslint-env browser */
const BaseCommand = require('./_base-command.js');

/**
 * Scrolls the window to the specified position.
 *
 * @example
 * browser.scrollTo(0, 100)
 * browser.scrollTo({
 *   left: 0,
 *   top: 100,
 *   behavior: 'smooth'
 * })
 *
 * @param {number|object} [x] The pixel along the horizontal axis of the element that you want displayed in the upper left.
 * @param {number} [y] The pixel along the vertical axis of the element that you want displayed in the upper left.
 * @param {object} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
class ScrollTo extends BaseCommand {
  get returnsFullResultObject() {
    return false;
  }

  async command(x, y, callback) {
    let scrollOptions;

    if (typeof x === 'object') {
      scrollOptions = x;
    } else {
      scrollOptions = {
        left: x || 0,
        top: y || 0,
        behavior: 'auto'
      };
    }

    const script = function(options) {
      window.scrollTo(options);

      return true;
    };

    const result = await this.executeScript(script, [scrollOptions]);

    if (typeof callback === 'function') {
      callback.call(this, result);
    }

    return result;
  }
}

module.exports = ScrollTo;
