const BaseCommand = require('../_base-command.js');

/**
 * Scrolls the page until the specified text is visible. Works for web applications.
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

  performAction(callback) {
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
        element.scrollIntoView({behavior: "smooth", block: "center"});
        return true;
      }
      return false;
    `;

    return this.executeScriptHandler('executeScript', script, [this.text], callback);
  }
}

module.exports = ScrollUntilText;
