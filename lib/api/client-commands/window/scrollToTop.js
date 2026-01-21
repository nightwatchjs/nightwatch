const BaseCommand = require('../_base-command');

/**
 * Scrolls the page to the top. Works for both web and native apps.
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

  async command(callback) {
    const {isMobile} = this.client.settings;

    if (isMobile) {
      // For native apps, use mobile-specific scrolling
      return this.executeScript(`
        if (window.ReactNativeWebView) {
          // React Native WebView
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'scroll',
            direction: 'top'
          }));
        } else if (window.webkit && window.webkit.messageHandlers) {
          // iOS WKWebView
          window.webkit.messageHandlers.scroll.postMessage({
            direction: 'top'
          });
        } else {
          // Fallback for other mobile webviews
          window.scrollTo(0, 0);
        }
      `, [], callback);
    }

    // For web browsers
    return this.executeScript('window.scrollTo(0, 0)', [], callback);

  }
}

module.exports = ScrollToTop;
