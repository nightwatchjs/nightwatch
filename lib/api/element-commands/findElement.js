/**
 * Search for an elements on the page, starting from the document root. The located element will be returned as web element JSON object (with an added .getId() convenience method).
 * First argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.findElement('.features-container li:first-child');
 *
 *     console.log('Element Id:', resultElement.getId());
 *   },
 *
 *
 * @link /#find-element
 * @syntax browser.findElement(selector, callback)
 * @syntax await browser.findElement(selector);
 * @param {string} selector The search target.
 * @param {function} [callback] Callback function to be invoked with the result when the command finishes.
 * @since 1.7.0
 * @api protocol.elements
 */
const FindElements = require('./findElements.js');

module.exports = class FindElement extends FindElements {
  async elementFound(response) {
    if (response && response.value) {
      const elementId = this.transport.getElementId(response.value);

      response.value = Object.assign(response.value, {
        get getId() {
          return function() {
            return elementId;
          };
        }
      });
    }

    return response;
  }

  findElementAction() {
    return this.findElement();
  }
};
