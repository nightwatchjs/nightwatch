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
      const _this = this;
      
      Object.assign(response.value, {
        get getId() {
          return function() {
            return elementId;
          };
        },

        findChildElement(...args) {
          return _this.createElementChain(this, false, ...args);
        },

        findChildElements(...args) {
          const promiseOnElements = _this.createElementChain(this, true, ...args);

          const getElementByIndex = (index) => {
            const promiseOnGetElementByIndex = (async () => {
              const elements = await promiseOnElements;
              return elements[index];
            })();
            
            promiseOnGetElementByIndex.findChildElements = this.findChildElements;
            promiseOnGetElementByIndex.findChildElement = this.findChildElement;

            return promiseOnGetElementByIndex;
          }
          
          promiseOnElements.getElementByIndex = getElementByIndex;
          return promiseOnElements;
        },
      });
    }

    return response;
  }

  createElementChain(element, multiElements, ...args) {
    let promise = Promise.resolve(element);

    promise = promise.then(async parent => {
      const parentId = () => parent.WebdriverElementId ? parent.WebdriverElementId : parent.getId();

      if (multiElements) {
        return await this.api.findElements(...args, parentId);
      }
  
      return await this.api.findElement(...args, parentId);
    });
    
    promise.findChildElement = element.findChildElement;
    promise.findChildElements = element.findChildElements;

    return promise;
  }

  findElementAction() {
    if (this.parentId) {
      return this.findElement({id: this.parentId, cacheElementId: false, transportAction: 'locateSingleElementByElementId'});
    }
    
    return this.findElement();
  }
};
