const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Search for multiple elements on the page, starting from the document root. The located elements will be returned as web element JSON objects.
 * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
 *
 * The locator strategy can be one of:
 * - `css selector`
 * - `link text`
 * - `partial link text`
 * - `tag name`
 * - `xpath`
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.elements('css selector', 'ul li', function(result) {
 *       console.log(result.value)
 *     });
 *   },
 *
 *   'es6 async demo Test': async function(browser) {
 *     const result = await browser.elements('css selector', 'ul li');
 *     console.log('result value is:', result.value);
 *   },
 *
 *   'page object demo Test': function (browser) {
 *      var nightwatch = browser.page.nightwatch();
 *      nightwatch
 *        .navigate()
 *        .assert.titleContains('Nightwatch.js');
 *
 *      nightwatch.api.elements('@featuresList', function(result) {
 *        console.log(result);
 *      });
 *
 *      browser.end();
 *   }
 * }
 *
 * @link /#find-elements
 * @syntax browser.findElements(using, value, callback)
 * @syntax browser.findElements(selector, callback)
 * @syntax await browser.findElements(selector);
 * @editline L734
 * @param {string|null} using The locator strategy to use.
 * @param {string} value The search target.
 * @param {function} callback Callback function to be invoked with the result when the command finishes.
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

    return result.value;
  }

};
