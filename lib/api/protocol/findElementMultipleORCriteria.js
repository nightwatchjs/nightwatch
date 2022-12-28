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
const Utils = require('../../utils/index.js');
const ProtocolAction = require('./_base-action.js');


module.exports = class FindElementMultipleORCriteria extends ProtocolAction {
  async command(...args) {
    let cssSelectors , xpathSelector, callback = function() {};

    args.forEach((selector) => {
      if (Utils.isString(selector)) {
        if (Utils.isValidXpath(selector)){
          xpathSelector = xpathSelector ? xpathSelector + " | " + selector : selector;
        } else {
          cssSelectors = cssSelectors ? cssSelectors + ", " + selector : selector;
        }
      }
    });

    if (Utils.isFunction(args.at(-1))) {
      callback = args.at(-1);
    }

    let result = [];

    if (cssSelectors) {
      const cssRes = await this.api.findElements(cssSelectors, callback);

      if (!cssRes.error) {
        result = result.concat(cssRes);
        result = Object.assign(cssRes, result);
      }
    }

    if (xpathSelector) {
      const xpathRes = await this.api.findElements('xpath', xpathSelector, callback)

      if (!xpathRes.error) {
        result = result.concat(xpathRes);
        result = Object.assign(xpathRes, result);
      }
    }

    return result;
  }
};
