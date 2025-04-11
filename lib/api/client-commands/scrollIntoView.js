const BaseCommand = require('./_base-command.js');

/**
 * Scrolls an element into view.
 *
 * @example
 * browser.scrollIntoView('#element-id')
 * browser.scrollIntoView('#element-id', {
 *   behavior: 'smooth',
 *   block: 'center',
 *   inline: 'nearest'
 * })
 *
 * @param {string} selector The CSS/Xpath selector of the element
 * @param {object} [options] Scroll options (behavior, block, inline)
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
class ScrollIntoView extends BaseCommand {
  static get isTraceable() {
    return true;
  }

  async command(selector, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    const defaultOptions = {
      behavior: 'auto',
      block: 'center',
      inline: 'nearest'
    };

    const scrollOptions = {...defaultOptions, ...options};

    const script = function(selector, options) {
      const element = document.querySelector(selector);
      if (!element) {
        return false;
      }
      element.scrollIntoView(options);

      return true;
    };

    const result = await this.executeScript(script, [selector, scrollOptions]);

    if (typeof callback === 'function') {
      callback.call(this, result);
    }

    return result;
  }
}

module.exports = ScrollIntoView;
