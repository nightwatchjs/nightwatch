const BaseCommand = require('../_base-command.js');

/**
 * Scrolls the page to the top. Works for web applications.
 *
 * @example
 * module.exports = {
 *   'scroll to top': function(browser) {
 *     browser.scrollToTop();
 *   }
 * };
 *
 * @method scrollToTop
 * @syntax .scrollToTop([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
class ScrollToTop extends BaseCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    return this.executeScriptHandler('executeScript', 'window.scrollTo(0, 0)', [], callback);
  }
}

module.exports = ScrollToTop;
