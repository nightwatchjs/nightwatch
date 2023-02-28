const {By, RelativeBy, until} = require('selenium-webdriver');
const Element = require('./index.js');
const ElementsByRecursion = require('./locate/elements-by-recursion.js');
const SingleElementByRecursion = require('./locate/single-element-by-recursion.js');

const AVAILABLE_LOCATORS = {
  'css selector': 'css',
  'id': 'id',
  'link text': 'linkText',
  'name': 'name',
  'partial link text': 'partialLinkText',
  'tag name': 'tagName',
  'xpath': 'xpath',
  'className': 'className'
};

class LocateElement {
  /**
   * @param {object|string} element
   * @return {By|RelativeBy}
   */
  static create(element) {
    if (!element) {
      throw new Error(`Error while trying to locate element: missing element definition; got: "${element}".`);
    }

    const byInstance = LocateElement.locateInstanceOfBy(element);
    if (byInstance !== null) {
      return byInstance;
    }

    const elementInstance = LocateElement.createElementInstance(element);

    return By[AVAILABLE_LOCATORS[elementInstance.locateStrategy]](elementInstance.selector);
  }

  /**
   * @param {object} element
   * @return {By|RelativeBy|null}
   */
  static locateInstanceOfBy(element) {
    if (element instanceof By) {
      return element;
    }

    if (element.by instanceof By) {
      return element.by;
    }

    if (element.value instanceof RelativeBy) {
      return element.value;
    }

    return null;
  }

  /**
   * @param {object|string} element
   * @return {Element}
   */
  static createElementInstance(element) {
    if (typeof element != 'object' && typeof element != 'string') {
      throw new Error(`Invalid element definition type; expected string or object, but got: ${typeof element}.`);
    }

    let selector;
    let strategy;

    if (typeof element == 'object' && element.value && element.using) {
      selector = element.value;
      strategy = element.using;
    } else {
      selector = element;
    }

    return Element.createFromSelector(selector, strategy);
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
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

  resolveElementRecursively({element}) {
    return this.findElement({element}).then(response => {
      const firstElement = element.selector[element.selector.length - 1];
      firstElement.resolvedElement = response;

      const {selector, locateStrategy, name} = firstElement;
      const {status, value} = response;
      const WebdriverElementId = response && response.WebdriverElementId || null;
      const result = {
        selector,
        locateStrategy,
        name,
        WebdriverElementId,
        response: {
          status,
          value
        }
      };

      if (!isNaN(firstElement.index)) {
        result.index = firstElement.index;
      }

      return result;
    });
  }

  /**
   * Finds a single element by using the multiple locate elements, which instead of throwing an error returns an empty array
   *
   * @param {Element} element
   * @param {String} commandName
   * @param {String} id
   * @param {String} transportAction
   * @param {Boolean} [returnSingleElement]
   * @param {Boolean} [cacheElementId]
   * @return {Promise}
   */
  async findElement({element, commandName, id, transportAction = 'locateMultipleElements', returnSingleElement = true, cacheElementId = true}) {
    if (element && (element.webElement || element.webElementId)) {
      const elementId = await (element.webElement || element.webElementId).getId();
      element.setResolvedElement(elementId);

      return {
        value: this.transport.toElement(elementId),
        status: 0
      };
    }

    if (element.resolvedElement && cacheElementId) {
      return Promise.resolve({
        value: this.transport.toElement(element.resolvedElement),
        status: 0
      });
    }

    if (element.usingRecursion) {
      if (transportAction === 'locateSingleElement') {
        return this.findSingleElementUsingRecursion(element);
      }

      return this.findElementsUsingRecursion({element, returnSingleElement});
    }

    const result = await this.executeProtocolAction({element, commandName, id, transportAction, cacheElementId});

    return this.handleLocateElement({result, element, returnSingleElement});
  }

  locateMultipleElements(element) {
    const commandName = 'locateMultipleElements';
    const transportAction = 'locateMultipleElements';

    return this.executeProtocolAction({element, commandName, transportAction});
  }

  handleLocateElement({result, element, returnSingleElement}) {
    const {status = 0, error} = result || {};
    let {value} = result;

    if (error instanceof Error) {
      return {
        error,
        status: -1,
        value
      };
    }

    let WebdriverElementId;
    const elementResult = this.transport.resolveElement(result, element, true);
    if (elementResult) {
      WebdriverElementId = this.transport.getElementId(elementResult);
      element.setResolvedElement(WebdriverElementId);
    }

    if (returnSingleElement) {
      value = elementResult;
    }

    return {
      value,
      status,
      WebdriverElementId
    };
  }

  /**
   * @returns Promise({{
   *    value,
   *    status,
   *    result,
   *    now
   * }})
   */
  executeProtocolAction(opts = {}) {
    const {id, element, transportAction, commandName, cacheElementId} = opts;
    const args = {
      id
    };

    if (element instanceof By) {
      args.by = element;
    } else {
      args.using = element.locateStrategy;
      args.value = element.selector;
    }

    return this.sendElementsAction({transportAction, args, element, cacheElementId})
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
      .catch(error => {
        return {
          value: null,
          status: -1,
          error
        };
      });
  }

  async sendElementsAction({transportAction, args, element, cacheElementId} = {}) {
    if (cacheElementId && transportAction === 'locateMultipleElements' && args && !(args.value instanceof RelativeBy)) {
      const timeout = element.timeout || this.settings.globals.waitForConditionTimeout;
      const retryInterval = element.retryInterval || this.settings.globals.waitForConditionPollInterval;

      try {
        const results = await this.transport.driver.wait(until.elementsLocated(args), timeout, null, retryInterval);
        const {elementKey} = this.transport;
        const value = await Promise.all(results.map(async webElement => {
          const elementId = await webElement.getId();

          return {[elementKey]: elementId};
        }));

        return {
          status: 0,
          value
        };
      } catch (err) {
        if (err.name !== 'TimeoutError') {
          throw err;
        }

        throw new NoSuchElementError({element, ms: timeout});
      }
    }

    return this.transport.executeProtocolAction(transportAction, args);
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

    throw new Error(`Element ${element.toString()} not found.${errorResult.message ? (' ' + errorResult.message) : ''}`);
  }

  /**
   * @param {Element} element
   * @param {Boolean} returnSingleElement
   * @return {Promise}
   */
  findElementsUsingRecursion({element, returnSingleElement = true}) {
    let recursion = new ElementsByRecursion(this.nightwatchInstance);

    return recursion.locateElements({element, returnSingleElement});
  }

  findSingleElementUsingRecursion(element) {
    let recursion = new SingleElementByRecursion(this.nightwatchInstance);

    return recursion.locateElement(element.selector);
  }
}

class NoSuchElementError extends Error {
  constructor({element, ms, abortOnFailure, retries}) {
    super();

    this.selector = element.selector;
    this.abortOnFailure = abortOnFailure;
    this.name = 'NoSuchElementError';
    this.retries = retries;
    this.strategy = element.locateStrategy;
    this.message = `Timed out while waiting for element "${this.selector}" with "${this.strategy}" to be present for ${ms} milliseconds.`;
  }
}

module.exports = LocateElement;
module.exports.NoSuchElementError = NoSuchElementError;
