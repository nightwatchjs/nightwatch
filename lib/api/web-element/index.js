const fs = require('fs');
const path = require('path');
const {until, WebElement, WebElementPromise} = require('selenium-webdriver');

const {Logger} = require('../../utils/');
const {ScopedValue} = require('./element-value.js');

const {ScopedElementLocator} = require('./element-locator.js');
const {ScopedElementAssertions} = require('./assert/element-assertions.js');

class ScopedWebElement {
  static get methodAliases() {
    return {
      'find': ['findElement', 'get'],
      'findAll': ['findElements', 'getAll'],
      'findByText': ['getByText'],
      'findByRole': ['getByRole'],
      'findByPlaceholderText': ['getByPlaceholderText'],
      'findByLabelText': ['getByLabelText'],
      'findByAltText': ['getByAltText'],
      'findAllByText': ['getAllByText'],
      'findAllByRole': ['getAllByRole'],
      'findAllByPlaceholderText': ['getAllByPlaceholderText'],
      'findAllByAltText': ['getAllByAltText'],
      'getRect': ['getSize', 'getLocation']
    }
  }

  static root(nightwatchInstance) {
    return new ScopedWebElement('html', null, nightwatchInstance);
  }

  static active(nightwatchInstance) {
    const {transportActions} = nightwatchInstance;
    const node = nightwatchInstance.queue.add(function findActiveElement() {
      return transportActions.getActiveElement();
    });
    const instance = new WebElement(nightwatchInstance.transport.driver, node.deferred.promise);

    return new ScopedWebElement(instance, null, nightwatchInstance);
  }

  get #driver() {
    return this.nightwatchInstance.transport.driver;
  }

  get #reporter() {
    return this.nightwatchInstance.reporter;
  }

  get #queue() {
    return this.nightwatchInstance.queue;
  }

  get assert() {
    return new ScopedElementAssertions(this, {
      negated: false,
      nightwatchInstance: this.nightwatchInstance
    });
  }

  static create(selector, parentElement, nightwatchInstance) {
    const instance = new ScopedWebElement(selector, parentElement, nightwatchInstance);
    const exported = {};

    const methodNames = instance.getMethodNames();
    methodNames.forEach((methodName) => {
      Object.defineProperty(exported, methodName, {
        value: (...args) => instance.executeMethod(instance, methodName, ...args),
        writable: false,
        enumerable: true,
        configurable: true
      });
    });

    Object.defineProperty(exported, 'assert', {
      get () {
        return instance.assert;
      },
      writable: false,
      enumerable: true,
      configurable: true
    });

    return exported;
  }

  constructor(element, parentElement, nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.parentScopedElement = parentElement;

    this.webElement = this.#createWebElementPromise({
      element,
      parentElement
    });

  }

  async #findElement({parentElement, condition, index, timeout, retryInterval}) {
    try {
      const webElements = parentElement
        ? await parentElement.webElement.findElements(condition)
        : await this.#driver.wait(until.elementsLocated(condition), timeout, null, retryInterval);

      if (webElements.length === 0) {
        throw new Error(`The element with a "${condition}" selector is not found.`);
      }

      if (index > webElements.length) {
        throw new Error(`The index "${index}" is out of bounds for selector "${condition}".`);
      }

      return webElements[index];
    } catch (error) {
      throw error;
    }
  }

  #createWebElementPromise({selector, parentElement}) {
    return new WebElementPromise(this.#driver, new Promise(async (resolve, reject) => {
      if (selector instanceof Promise) {
        try {
          selector = await selector;
        } catch (error) {
          return reject(error);
        }
      }

      const {index, timeout, condition, retryInterval, abortOnFailure, suppressNotFoundErrors} = ScopedElementLocator.create(selector, this.nightwatchInstance);
      if (condition instanceof WebElement || condition instanceof WebElementPromise) {
        return resolve(condition);
      }

      try {
        const webElement = await this.#findElement({parentElement, condition, index, timeout, retryInterval});

        resolve(webElement);
      } catch (error) {
        if (suppressNotFoundErrors) {
          return resolve(null);
        }

        const narrowedError = createNarrowedError({error, condition, timeout});
        Logger.error(narrowedError);

        if (abortOnFailure) {
          this.#reporter.registerTestError(narrowedError);

          reject(narrowedError);
        } else {
          resolve(null);
        }
      }
    }));
  }



  /**
   * Keeps in sync operation sequence produced by methods.
   */
  #waitFor(promise) {
    this.webElement = new WebElementPromise(this.#driver, this.then(async (element) => {
      await promise;

      return element;
    }));

    return this;
  }

  #runQueuedCommand(commandName, {scopedValue = false, args = []} = {}) {
    const node = this.#queueAction((actions, webElement) => function () {
      return actions[commandName](webElement, ...args);
    });

    if (scopedValue) {
      return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
    }

    return this.#waitFor(node.deferred.promise);
  }

  #runQueuedCommandScoped(commandName, ...args) {
    return this.#runQueuedCommand(commandName, {scopedValue: true, args});
  }


  #queueAction(createAction) {
    return this.#queue.add(createAction(this.nightwatchInstance.transportActions, this.webElement));
  }

  executeMethod(context, methodName, ...args) {
    const methodPath = path.resolve(__dirname, 'commands', `${methodName}.js`);
    const methodFunc = require(methodPath);

    return methodFunc.command.call(context, ...args);
  }

  getMethodNames() {
    const methodsDir = path.resolve(__dirname, 'commands');
    const methodFiles = fs.readdirSync(methodsDir);

    return methodFiles
      .map(fileName => path.parse(fileName).name)
      .flatMap(commandName => ScopedWebElement.methodAliases[commandName] || [commandName])
      .filter(fileName => !fileName.startsWith('_'));
  }

  then(onFulfilled, onRejected) {
    return this.webElement.then(onFulfilled, onRejected);
  }
}

module.exports.ScopedWebElement = ScopedWebElement;

function createNarrowedError({error, condition, timeout}) {
  return error.name === 'TimeoutError'
    ? new Error(`Timed out while waiting for element "${condition}" to be present for ${timeout} milliseconds.`)
    : error;
}