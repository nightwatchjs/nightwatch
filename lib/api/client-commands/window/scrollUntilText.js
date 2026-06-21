const BaseCommand = require('../_base-command');

/**
 * Scrolls the page until the specified text is visible. Works for both web and native apps.
 *
 * @example
 * module.exports = {
 *   'scroll until text is visible': function(browser) {
 *     browser.scrollUntilText('Welcome to our site');
 *   }
 * };
 *
 * @method scrollUntilText
 * @syntax .scrollUntilText(text, [callback])
 * @param {string} text The text to scroll until visible.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
class ScrollUntilText extends BaseCommand {
  static get isTraceable() {
    return true;
  }

  async command(text, callback) {
    const {isMobile} = this.client.settings;

    const script = `
      function findText(text) {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.includes(text)) {
            return node.parentElement;
          }
        }
        return null;
      }
      
      const element = findText(arguments[0]);
      if (element) {
        if (window.ReactNativeWebView) {
          // React Native WebView
          const rect = element.getBoundingClientRect();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'scroll',
            target: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            }
          }));
          return true;
        } else if (window.webkit && window.webkit.messageHandlers) {
          // iOS WKWebView
          const rect = element.getBoundingClientRect();
          window.webkit.messageHandlers.scroll.postMessage({
            target: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            }
          });
          return true;
        } else {
          // Fallback for other mobile webviews and web browsers
          element.scrollIntoView({behavior: "smooth", block: "center"});
          return true;
        }
      }
      return false;
    `;

    if (isMobile) {
      // For native apps
      return this.executeScript(script, [text], callback);
    }

    // For web browsers
    return this.executeScript(script, [text], callback);

  }
}

module.exports = ScrollUntilText;
