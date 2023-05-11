const fs = require('fs');
const path = require('path');
const {until, WebElement, WebElementPromise, Condition} = require('selenium-webdriver');
const {ShadowRoot} = require('selenium-webdriver/lib/webdriver');

const {Logger, isFunction, createPromise} = require('../../utils/');
const {WEB_ELEMENT_ID} = require('../../transport/selenium-webdriver/session.js');
const {ScopedElementLocator} = require('./element-locator.js');

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
      'getRect': ['getSize', 'getLocation'],
      'getProperty': ['property'],
      'getCssProperty': ['css']
    };
  }

  static getMethodNames() {
    const methodsDir = path.resolve(__dirname, 'commands');
    const methodFiles = fs.readdirSync(methodsDir);

    return methodFiles
      .map(fileName => path.parse(fileName).name)
      .flatMap(commandName => {
        const aliases = ScopedWebElement.methodAliases[commandName];

        const commandNames = [{commandName}];

        if (aliases) {
          commandNames.push(...aliases.map(commandNameAlias => ({commandName: commandNameAlias, originalCommandName: commandName})));
        }

        return commandNames;
      })
      .filter(({commandName: fileName}) => !fileName.startsWith('_'));
  }

  get driver() {
    return this.nightwatchInstance.transport.driver;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get queue() {
    return this.nightwatchInstance.queue;
  }

  get __nightwatchScopedWebElement__() {
    return true;
  }

  constructor(selector = 'html', parentElement, nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.parentScopedElement = parentElement;

    this.webElement = this.createWebElementPromise({
      selector,
      parentElement
    });

  }

  async waitUntilElementsLocated(selector) {
    const {timeout, condition, retryInterval} = ScopedElementLocator.create(selector, this.nightwatchInstance);
    const webElements = await this.driver.wait(until.elementsLocated(condition), timeout, null, retryInterval);

    if (webElements.length === 0) {
      return null;
    }

    return webElements[0];
  }

  async locateElements({parentElement, selector, timeout, retryInterval}) {
    const createLocateElement = () => {
      return parentElement && parentElement.webElement ? function(locator) {
        return new Condition('for at least one element to be located ' + locator, function (driver) {
          return parentElement.webElement.findElements(locator).then(function (elements) {
            return elements.length > 0 ? elements : null;
          });
        });
      } : until.elementsLocated;
    };

    const locateFn = createLocateElement();
    const webElements = await this.driver.wait(locateFn(selector), timeout, null, retryInterval);

    return webElements;
  }

  async findElementUsingRecursion({parentElement, recursiveElement, timeout, retryInterval}) {
    const allElements = Array.isArray(recursiveElement.selector) ? recursiveElement.selector.slice() : [
      recursiveElement
    ];

    let result = null;
    while (allElements.length > 0) {
      const nextElement = allElements.shift();
      if (result) {
        parentElement = {webElement: result};
      }

      const {condition, index} = ScopedElementLocator.create(nextElement, this.nightwatchInstance);
      result = await this.findElement({parentElement, selector: condition, index, timeout, retryInterval});

      if (!result) {
        break;
      }
    }

    return result;
  }

  async findElement({parentElement, selector, index, timeout, retryInterval}) {
    const webElements = await this.locateElements({parentElement, selector, timeout, retryInterval});

    if (webElements.length === 0) {
      const err = new Error(`Cannot find element with "${selector}" selector in ${timeout} milliseconds.`);
      this.reporter.registerTestError(err);

      return;
    }

    if (index > webElements.length) {
      const err = new Error(`The index "${index}" is out of bounds for selector "${selector}".`);
      this.reporter.registerTestError(err);

      return;
    }

    return webElements[index];
  }

  async findElementAction({parentElement, condition, index, timeout, retryInterval, abortOnFailure, suppressNotFoundErrors}) {
    const createAction = () => async ({args}) => {
      const parentElement = args[0];

      try {
        if (condition.usingRecursion) {
          return await this.findElementUsingRecursion({parentElement, recursiveElement: condition, timeout, retryInterval});
        }

        return await this.findElement({parentElement, selector: condition, index, timeout, retryInterval});
      } catch (error) {
        if (suppressNotFoundErrors) {
          return null;
        }

        const narrowedError = createNarrowedError({error, condition, timeout});
        Logger.error(narrowedError);

        if (abortOnFailure) {
          this.reporter.registerTestError(narrowedError);
          // TODO: find a way to reject here without unhandled promise rejection
          // reject(narrowedError);
        }

        return null;
      }
    };

    const node = this.queueAction({name: 'find', createAction, namespace: 'element', args: [parentElement]});

    node.printArgs = function() {
      if (condition.selector) {
        return `{ ${condition.selector} }`;
      }

      return `{ ${condition} }`;
    };

    return node.deferred.promise;
  }

  createWebElementPromise({selector, parentElement}) {
    if (!selector) {
      return null;
    }

    // eslint-disable-next-line no-async-promise-executor
    return new WebElementPromise(this.driver, new Promise(async (resolve, reject) => {
      if (selector instanceof Promise) {
        try {
          selector = await selector;
        } catch (error) {
          return reject(error);
        }
      }

      if (!selector) {
        return resolve(null);
      }

      if (selector instanceof WebElement) {
        return resolve(selector);
      }

      if (selector instanceof ShadowRoot) {
        return resolve(selector);
      }

      if (selector[WEB_ELEMENT_ID] && isFunction(selector.getId)) {
        const webElement = new WebElement(this.driver, selector.getId());

        return resolve(webElement);
      }

      const {index, timeout, condition, retryInterval, abortOnFailure, suppressNotFoundErrors} = ScopedElementLocator.create(selector, this.nightwatchInstance);
      if (condition instanceof WebElement || condition instanceof WebElementPromise) {
        return resolve(condition);
      }

      const webElement = await this.findElementAction(
        {parentElement, condition, index, timeout, retryInterval, abortOnFailure, suppressNotFoundErrors}
      );
      resolve(webElement);
    }));
  }

  /**
   * Keeps in sync operation sequence produced by methods.
   */
  waitFor(promise, {isRoot = false} = {}) {
    if (isRoot) {
      this.webElement = promise;
    } else {
      this.webElement = new WebElementPromise(this.driver, this.then(async (element) => {
        await promise;

        return element;
      }));
    }

    return this;
  }

  createRootElementCommand(name, context, args) {
    const result = context[name](...args, {isRoot: true});

    return result;
  }

  createNode(commandName, args) {
    const createAction = (actions, webElement) => function () {
      if (isFunction(commandName)) {
        return commandName(webElement, ...args).then((result) => {
          node.deferred.resolve(result);
        });
      }

      return actions[commandName](webElement, ...args).then((result) => {
        // eslint-disable-next-line no-prototype-builtins
        node.deferred.resolve(result.hasOwnProperty('value') ? result.value : result);
      });
    };

    const node = this.queueAction({name: commandName, createAction});

    return node;
  }

  runQueuedCommand(commandName, {args = [], namespace, isRoot = false, name} = {}) {
    const node = this.createNode(commandName, args, namespace);

    if (name) {
      node.name = name;
    }

    return this.waitFor(node.deferred.promise, {isRoot});
  }

  queueAction({name, createAction, namespace = 'element()', args = [], rejectPromise = true} = {}) {
    const opts = {
      args,
      context: null,
      deferred: createPromise(),
      commandFn: createAction.call(this, this.nightwatchInstance.transportActions, this.webElement),
      namespace,
      rejectPromise,
      commandName: name
    };

    return this.queue.add(opts);
  }

  executeMethod(context, methodName, ...args) {
    const methodPath = path.resolve(__dirname, 'commands', `${methodName}.js`);
    const methodFunc = require(methodPath);

    return methodFunc.command.call(context, ...args);
  }


  then(onFulfilled, onRejected) {
    return this.webElement.then(onFulfilled, onRejected);
  }
}

function createNarrowedError({error, condition, timeout}) {
  return error.name === 'TimeoutError'
    ? new Error(`Timed out while waiting for element "${condition}" to be present for ${timeout} milliseconds.`)
    : error;
}

module.exports = ScopedWebElement;
