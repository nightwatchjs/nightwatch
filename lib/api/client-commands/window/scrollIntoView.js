/**
 * Scrolls an element into view. Works for both web and native apps.
 * Supports multiple selector types: CSS, XPath, ID, aria-label, etc.
 *
 * @example
 * module.exports = {
 *   'scroll element into view': function(browser) {
 *     // Using CSS selector
 *     browser.scrollIntoView('#myElement');
 *     // Using XPath
 *     browser.scrollIntoView('//div[@id="myElement"]', 'xpath');
 *     // Using aria-label
 *     browser.scrollIntoView('[aria-label="Learn More"]');
 *     // Using ID
 *     browser.scrollIntoView('#myElement');
 *   }
 * };
 *
 * @method scrollIntoView
 * @syntax .scrollIntoView(selector, [callback])
 * @syntax .scrollIntoView(using, selector, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
module.exports = class ScrollIntoView {
  command(using, selector, callback) {
    let usingValue = 'css selector';
    let selectorValue;
    let callbackValue;

    // Handle different argument combinations
    if (arguments.length === 1) {
      // scrollIntoView(selector)
      selectorValue = using;
      // Auto-detect selector type
      if (selectorValue.startsWith('//')) {
        usingValue = 'xpath';
      } else if (selectorValue.startsWith('#')) {
        usingValue = 'css selector';
      } else if (selectorValue.startsWith('aria=')) {
        usingValue = 'css selector';
        selectorValue = `[aria-label="${selectorValue.substring(5)}"]`;
      }
    } else if (arguments.length === 2) {
      if (typeof selector === 'function') {
        // scrollIntoView(selector, callback)
        selectorValue = using;
        callbackValue = selector;
        // Auto-detect selector type
        if (selectorValue.startsWith('//')) {
          usingValue = 'xpath';
        } else if (selectorValue.startsWith('#')) {
          usingValue = 'css selector';
        } else if (selectorValue.startsWith('aria=')) {
          usingValue = 'css selector';
          selectorValue = `[aria-label="${selectorValue.substring(5)}"]`;
        }
      } else {
        // scrollIntoView(using, selector)
        usingValue = using;
        selectorValue = selector;
      }
    } else {
      // scrollIntoView(using, selector, callback)
      usingValue = using;
      selectorValue = selector;
      callbackValue = callback;
    }

    return this.api
      .waitForElementPresent(selectorValue, usingValue)
      .moveToElement(selectorValue, 0, 0, usingValue)
      .execute(
        'arguments[0].scrollIntoView({behavior: "smooth", block: "center"});',
        [{using: usingValue, selector: selectorValue}],
        function(result) {
          if (typeof callbackValue === 'function') {
            callbackValue.call(this, result);
          }
        }
      );
  }
};
