const BaseCommand = require('../_base-command.js');

/**
 * Scrolls an element into view with customizable behavior.
 * Works for web applications.
 *
 * @example
 * module.exports = {
 *   'scroll element into view': function(browser) {
 *     browser.scrollIntoView({
 *       element: '#myElement', // Can be CSS selector or XPath
 *       behavior: 'smooth',
 *       block: 'center'
 *     });
 *   }
 * };
 *
 * @method scrollIntoView
 * @param {Object} options The options for scrolling
 * @param {string} options.element The selector (CSS) or XPath of the element to scroll to
 * @param {string} [options.behavior='auto'] The scroll behavior ('auto', 'smooth')
 * @param {string} [options.block='start'] The vertical alignment ('start', 'center', 'end', 'nearest')
 * @param {string} [options.inline='nearest'] The horizontal alignment ('start', 'center', 'end', 'nearest')
 * @api protocol.window
 */
module.exports = class ScrollIntoView {
  command(options, callback) {
    const {
      element,
      behavior = 'auto',
      block = 'start',
      inline = 'nearest'
    } = options;

    // Check if it's an XPath selector
    const isXPath = element.startsWith('//') || element.startsWith('(//');

    const api = this.api;

    if (isXPath) {
      api.useXpath();
    }

    return api
      .waitForElementPresent(element)
      .moveToElement(element, 0, 0)
      .execute(function(selector, scrollOptions, isXPathSelector) {
        /* global document, XPathResult */
        let targetElement;

        if (isXPathSelector) {
          const xpathResult = document.evaluate(
            selector,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          targetElement = xpathResult.singleNodeValue;
        } else {
          targetElement = document.querySelector(selector);
        }

        if (targetElement) {
          targetElement.scrollIntoView(scrollOptions);

          return true;
        }

        return false;
      }, [element, {behavior, block, inline}, isXPath], function(result) {
        if (isXPath) {
          api.useCss();
        }

        if (typeof callback === 'function') {
          callback.call(this, result);
        }
      });
  }
};
