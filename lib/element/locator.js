const Logger = require('../util/logger.js');
const Utils = require('../util/Utils.js');
const Transport = require('../transport/transport.js');
const Element = require('./element.js');
const ElementsByRecursion = require('./locate/elements-by-recursion.js');
const SingleElementByRecursion = require('./locate/single-element-by-recursion.js');

class LocateElement {
  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

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
        let message = `More than one element (${value.length}) found for <${element.toString()}> with selector: "${element.selector}".`;

        if (this.settings.globals.throwOnMultipleElementsReturned) {
          throw new Error(message);
        }

        if (this.settings.output) {
          console.warn(Logger.colors.green(`  Warning: ${message} Only the first one will be used.`));
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
      value: typeof parsedValue == 'undefined' ? value : parsedValue
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

    result = this.transport.getElementNotFoundResult(result);

    throw result;
  }

  /**
   * Used by waitForElement commands
   *
   * @param {Element} element
   * @return {Promise}
   */
  findElements(element) {
    if (element.resolvedElement) {
      return Promise.resolve(element.resolvedElement);
    }

    if (element.usingRecursion) {
      return this.findElementsUsingRecursion(element);
    }

    return this.locateMultipleElements(element);
  }

  locateMultipleElements(element) {
    return this.transport.executeProtocolAction('locateMultipleElements', [element.locateStrategy, element.selector])      .then(result => {
      if (this.transport.isResultSuccess(result) && Element.requiresFiltering(element)) {
        return this.filterElements(element, result);
      }

      return result;
    })
    .catch(result => {
      if (this.transport.invalidSessionError(result)) {
        return new Error(`An error occurred while running ".findElements()": ${this.transport.getErrorMessage(result)}.`);
      }

      throw result;
    })
    .then(result => {
      if (!result) {
        return null;
      }

      const elementResult = this.resolveElement(result, element, true);
      const now = new Date().getTime();

      if (elementResult && elementResult.value) {
        return {
          value: elementResult.value,
          status: elementResult.status,
          result,
          now
        };
      }

      return {
        value: null,
        status: 0,
        result,
        now
      };
    });
  }

  /**
   * Used by expect element assertions and element commands, such as .click()
   *
   * @param {Element} element
   * @return {Promise}
   */
  locateElement(element) {
    if (element.usingRecursion) {
      return Element.requiresFiltering(element) ?
        this.findElementsUsingRecursion(element):
        this.findSingleElementUsingRecursion(element);
    }

    let elementAction = Transport.getElementAction(element);

    return this.callElementLocateAction(element, elementAction, [element.locateStrategy, element.selector]);
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

  /**
   * Used by recursive lookup command for a single element
   *
   * @param {string} parentElementId
   * @param {Element} element
   * @return {Promise}
   */
  findElementFromParent(parentElementId, element) {
    return this.transport.executeProtocolAction('locateMultipleElementsByElementId', [
      parentElementId, element.locateStrategy, element.selector
    ])
    .then(result => {
      if (this.transport.isResultSuccess(result) && Element.requiresFiltering(element)) {
        return this.filterElements(element, result);
      }

      return result;
    })
    .then(result => {
      let elementResult = this.resolveElement(result, element, Element.requiresFiltering(element) || multipleElements);
      if (elementResult) {
        return elementResult;
      }

      throw result;
    });
  }

  /**
   * Used by recursive lookup command for multi elements (in page objects)
   *
   * @param {Object} result
   * @param {Element} element
   * @return {Promise}
   */
  locateMultipleElementsFromParent(result, element) {
    let promises = [];

    result.value.forEach(elementId => {
      promises.push(this.findElementFromParent(elementId, element));
    });

    return Utils.runPromises(promises).then(results => {
      if (results.length === 1 && results[0] instanceof Error) {
        throw results[0];
      }

      let failed = 0;
      let elementResult = results.reduce((prev, item) => {
        // In case we have multiple matches on the same element, only add once
        if (this.transport.isResultSuccess(item) && prev.value.indexOf(item.value) < 0) {
          prev.value.push(item.value);
        } else {
          if (item instanceof Error) {
            Logger.error(item.stack);
          }

          failed++;
        }

        return prev;
      }, {value: [], status: 0});

      if (failed === results.length) {
        elementResult = this.transport.getElementNotFoundResult(elementResult);
      }

      return elementResult;
    });
  }
}

module.exports = LocateElement;
