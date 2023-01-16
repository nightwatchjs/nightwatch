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
const {Strategies} = require('../../utils/locatestrategy.js');
const ProtocolAction = require('./_base-action.js');


module.exports = class FindElementMultipleORCriteria extends ProtocolAction {
  async command(...args) {
    let cssSelectors;
    let xpathSelector; 
    let callback = function() {};
    const selectors = [];
    
    args.forEach((selector) => {
      if (Utils.isString(selector)) {
        if (Utils.isValidXpath(selector)){
          xpathSelector = xpathSelector ? xpathSelector + ' | ' + selector : selector;
        } else {
          cssSelectors = cssSelectors ? cssSelectors + ', ' + selector : selector;
        }
      } else if (Utils.isObject(selector)) {
        if (selector.using === Strategies.XPATH){
          xpathSelector = xpathSelector ? xpathSelector + ' | ' + selector.value : selector.value;
        } else if (selector.using === Strategies.CSS_SELECTOR) {
          cssSelectors = cssSelectors ? cssSelectors + ', ' + selector.value : selector.value;
        } else {
          selectors.push(selector);
        }
      }
    });

    const lastItem = args.pop();
    if (Utils.isFunction(lastItem)) {
      callback = lastItem;
    }

    if (cssSelectors) {
      selectors.push({
        using: Strategies.CSS_SELECTOR,
        value: cssSelectors
      });
    }

    if (xpathSelector) {
      selectors.push({
        using: Strategies.XPATH,
        value: xpathSelector
      });
    }
    
    return this.transportActions.findElementMultipleORCriteria(selectors, callback);
  }
};
