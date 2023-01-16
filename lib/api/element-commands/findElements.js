const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Search for multiple elements on the page, starting from the document root. The located elements will be returned as web element JSON objects (with an added .getId() convenience method).
 * First argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElements = await browser.findElements('.features-container li');
 *
 *     resultElements.forEach(item => console.log('Element Id:', item.getId()));
 *   },
 *
 *
 * @link /#find-elements
 * @syntax browser.findElements(selector, callback)
 * @syntax await browser.findElements(selector);
 * @param {string} selector The search target.
 * @param {function} [callback] Callback function to be invoked with the result when the command finishes.
 * @since 1.7.0
 * @api protocol.elements
 */
module.exports = class Elements extends BaseElementCommand {
  async elementFound(response) {
    if (response && Array.isArray(response.value)) {
      response.value = response.value.map(entry => {
        const elementId = this.transport.getElementId(entry);

        return Object.assign(entry, {
          get getId() {
            return function() {
              return elementId;
            };
          }
        });
      });
    }

    return response;
  }

  findElementAction() {
    return this.findElement({returnSingleElement: false});
  }

  async complete(err, response) {
    const result = await super.complete(err, response);
    if (result instanceof Error) {
      return result;
    }

    return result;
  }

};
