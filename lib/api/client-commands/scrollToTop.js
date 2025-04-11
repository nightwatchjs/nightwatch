const BaseCommand = require('./_base-command.js');

/**
 * Scrolls to the top of the page.
 *
 * @example
 * browser.scrollToTop()
 * browser.scrollToTop({behavior: 'smooth'})
 *
 * @param {object} [options] Scroll options (behavior)
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
class ScrollToTop extends BaseCommand {
  get returnsFullResultObject() {
    return false;
  }

  async command(options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    const defaultOptions = {
      behavior: 'auto'
    };

    const scrollOptions = {...defaultOptions, ...options};

    const script = function(options) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: options.behavior
      });

      return true;
    };

    const result = await this.executeScript(script, [scrollOptions]);

    if (typeof callback === 'function') {
      callback.call(this, result);
    }

    return result;
  }
}

module.exports = ScrollToTop;
