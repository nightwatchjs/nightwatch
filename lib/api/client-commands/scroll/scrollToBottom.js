const BaseCommand = require('../_base-command.js');

/**
 * Scrolls the page to the bottom. Works for web applications.
 *
 * @example
 * module.exports = {
 *   'scroll to bottom': function(browser) {
 *     browser.scrollToBottom();
 *   }
 * };
 *
 * @method scrollToBottom
 * @syntax .scrollToBottom([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
class ScrollToBottom extends BaseCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    return this.executeScriptHandler('executeScript', 'window.scrollTo(0, document.body.scrollHeight)', [], callback);
  }
}

module.exports = ScrollToBottom;
