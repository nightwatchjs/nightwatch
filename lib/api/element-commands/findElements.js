const { WebElement } = require('selenium-webdriver');
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

      const driver = this.transport.driver;

      Object.assign(response.value, {
        getElementByIndex(index) {
          return response.value[index];
        },

        filterVisibleElements() {
          const promises = response.value.map(async element => {
            const webElement = new WebElement(driver, element.getId());

            if (await webElement.isDisplayed()) {
              return element;
            }
          })

          const visibleElements = (async() => (await Promise.all(promises)).filter((element) => {
            return element;
          }))();

          return visibleElements;
        },

        filterByText(text) {
          const promises = response.value.map(async element => {
          const webElement = new WebElement(driver, element.getId());

            if ((await webElement.getAttribute("textContent")).includes(text)) {
              return element;
            }
          })

          const elementsHasText = (async() => (await Promise.all(promises)).filter((element) => {
            return element;
          }))();

          return elementsHasText;
        },

        filterByCSS(className) {
          const promises = response.value.map(async element => {
          const webElement = new WebElement(driver, element.getId());

            if ((await webElement.getAttribute("class")).includes(className)) {
              return element;
            }
          })

          const elementsHasText = (async() => (await Promise.all(promises)).filter((element) => {
            return element;
          }))();

          return elementsHasText;
        },
      })
    }

    return response;
  }

  findElementAction() {
    if (this.parentId) {
      return this.findElement({id: this.parentId, cacheElementId: false, transportAction: 'locateMultipleElementsByElementId', returnSingleElement: false});
    }
    
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
