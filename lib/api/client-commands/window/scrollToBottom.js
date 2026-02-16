const BaseCommand = require('../_base-command');

/**
 * Scrolls the page to the bottom. Works for both web and native apps.
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

  async command(callback) {
    const {isMobile} = this.client.settings;

    if (isMobile) {
      // For native apps, use mobile-specific scrolling
      return this.executeScript(`
        if (window.ReactNativeWebView) {
          // React Native WebView
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'scroll',
            direction: 'bottom'
          }));
        } else if (window.webkit && window.webkit.messageHandlers) {
          // iOS WKWebView
          window.webkit.messageHandlers.scroll.postMessage({
            direction: 'bottom'
          });
        } else {
          // Fallback for other mobile webviews
          window.scrollTo(0, document.body.scrollHeight);
        }
      `, [], callback);
    }

    // For web browsers
    return this.executeScript('window.scrollTo(0, document.body.scrollHeight)', [], callback);

  }
}

module.exports = ScrollToBottom;
