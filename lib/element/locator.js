const Logger = require('../util/logger.js');
const Utils = require('../util/utils.js');
const Element = require('./element.js');
const ElementsByRecursion = require('./locate/elements-by-recursion.js');
const SingleElementByRecursion = require('./locate/single-element-by-recursion.js');

class LocateElement {
  get api() {
    return this.nightwatchInstance.api;
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get desiredCapabilities() {
    return this.nightwatchInstance.session.desiredCapabilities;
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  /**
   * Finds a single element by using the multiple locate elements, which instead of throwing an error returns an empty array
   *
   * {element, commandName, id, transportAction}
   * @return {Promise}
   */
  findElement({element, commandName, id, transportAction = 'locateMultipleElements'}) {
    if (element.resolvedElement) {
      return Promise.resolve(element.resolvedElement);
    }

    if (element.usingRecursion) {
      if (transportAction === 'locateSingleElement') {
        return this.findSingleElementUsingRecursion(element);
      }

      return this.findElementsUsingRecursion(element);
    }

    return this.executeProtocolAction({element, commandName, id, transportAction})
      .then(result => {
        return this.handleLocateSingleElement(result, element);
      });
  }

  resolveElementRecursively({element}) {
    return this.findElement({element}).then(response => {
      const firstElement = element.selector[element.selector.length - 1];
      firstElement.resolvedElement = response;

      const result = {
        selector: firstElement.selector,
        locateStrategy: firstElement.locateStrategy,
        name: firstElement.name,
        response: {
          status: response.status,
          value: response.value
        }
      };

      if (!isNaN(firstElement.index)) {
        result.index = firstElement.index;
      }

      return result;
    });
  }

  locateMultipleElements(element) {
    const commandName = 'locateMultipleElements';
    const transportAction = 'locateMultipleElements';

    return this.executeProtocolAction({element, commandName, transportAction})
  }

  handleLocateSingleElement(result, element) {
    const now = new Date().getTime();
    let value = null;
    let status = Utils.isUndefined(result.status) ? 0 : result.status;

    if (result) {
      const elementResult = this.resolveElement(result, element, true);

      if (elementResult && !Utils.isUndefined(elementResult.value) && elementResult.value !== null) {
        value = elementResult.value;
        status = elementResult.status;
        result.WebdriverElementId = value;
      }
    }

    return {
      // the WebElement id
      value,
      // status of the operation: 0 = success, -1 = failed
      status,
      // original WebDriver response
      result,
      // current timestamp
      now,

      error: result.error
    };
  }

  /**
   * Resolves the element ID based on the current transport used
   *
   * @param {Object} result
   * @param {Element} element
   * @param {Boolean} multipleElements
   * @return {{value: *, status: number}|null}
   */
  resolveElement(result, element, multipleElements) {
    if (!this.transport.isResultSuccess(result)) {
      return null;
    }

    let value = result.value;

    if (multipleElements && Array.isArray(value) && value.length > 0) {
      if (value.length > 1) {
        let message = `More than one element (${value.length}) found for element <${element.toString()}> with selector: "${element.selector}".`;

        if (this.settings.globals.throwOnMultipleElementsReturned) {
          throw new Error(message);
        }

        if (this.settings.output && !this.settings.globals.suppressWarningsOnMultipleElementsReturned) {
          Logger.warn(`  Warning: ${message} Only the first one will be used.`);
        }
      }
      value = value[0];
    } else if (Array.isArray(value) && value.length === 0) {
      value = null;
    }

    let parsedValue = value && this.transport.getElementId(value);

    return {
      status: 0,
      // for recursive lookups, the value is already parsed
      value: Utils.isUndefined(parsedValue) ? value : parsedValue
    };
  }

  /**
   * Selects a subset of elements if the result requires filtering.
   *
   * @param {Element} element
   * @param {object} result
   * @return {*}
   */
  filterElements(element, result) {
    let filtered = Element.applyFiltering(element, result.value);

    if (filtered) {
      result.value = filtered;

      return result;
    }

    const errorResult = this.transport.getElementNotFoundResult(result);

    const err = new Error(`Element ${element.toString()} not found.${errorResult.message ? (' ' + errorResult.message) : ''}`);
    err.detailedErr = errorResult.status;

    throw err;
  }

  /**
   *
   * @param {String} [id]
   * @param {Element} element
   * @param {string} transportAction
   * @param {string} commandName
   * @param {Array} [extraArgs]
   *
   * @returns Promise({{
   *    value,
   *    status,
   *    result,
   *    now
   * }})
   */
  executeProtocolAction({id, element, transportAction, commandName}) {
    const args = {
      id,
      using: element.locateStrategy,
      value: element.selector
    };

    return this.transport.executeProtocolAction(transportAction, args)
      .catch(err => {
        if (this.transport.invalidSessionError(err)) {
          return new Error(this.transport.getErrorMessage(err));
        }

        throw err;
      })

      .then(result => {
        if (this.transport.isResultSuccess(result) && Element.requiresFiltering(element)) {
          return this.filterElements(element, result);
        }

        return result;
      })
      // Catch errors from filterElements and from invalid session
      .catch(err => {
        err.message = `An error occurred while running .${commandName}(): ${err.message || 'Unknown error'}`;
        Utils.errorToStackTrace(err);

        return {
          value: null,
          status: -1,
          err
        };
      });
  }

  /**
   * Used by recursive lookup command for a single element
   *
   * @param {string} id
   * @param {Element} element
   * @param {string} commandName
   * @param {string} transportAction
   * @return {Promise}
   */
  findElementFromParent({id, element, transportAction = 'locateMultipleElementsByElementId', commandName = 'elementIdElements'}) {
    return this.findElement({
      id,
      element,
      commandName,
      transportAction
    });
  }

  /**
   * @param {Element} element
   * @return {Promise}
   */
  findElementsUsingRecursion(element) {
    let recursion = new ElementsByRecursion(this.nightwatchInstance);

    return recursion.locateElements(element.selector);
  }

  findSingleElementUsingRecursion(element) {
    let recursion = new SingleElementByRecursion(this.nightwatchInstance);

    return recursion.locateElement(element.selector);
  }
}

module.exports = LocateElement;
