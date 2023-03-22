const fs = require('fs');
const path = require('path');
const {until, WebElement, WebElementPromise} = require('selenium-webdriver');

const {Logger, isFunction, createPromise} = require('../../utils/');
const {WEB_ELEMENT_ID} = require('../../transport/selenium-webdriver/session.js');
const ScopedValue = require('./element-value.js');

const Element = require('../../element/');
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
      'getRect': ['getSize', 'getLocation'],
      'getProperty': ['property'],
      'getCssProperty': ['css']
    }
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

  static root(nightwatchInstance) {
    return ScopedWebElement.create('html', null, nightwatchInstance);
  }

  static active(nightwatchInstance) {
    const {transportActions} = nightwatchInstance;
    const node = nightwatchInstance.queue.add(function findActiveElement() {
      return transportActions.getActiveElement();
    });
    const instance = new WebElement(nightwatchInstance.transport.driver, node.deferred.promise);

    return ScopedWebElement.create(instance, null, nightwatchInstance);
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
    const exported = Element.createFromSelector(selector);

    const methodNames = ScopedWebElement.getMethodNames();
    methodNames.forEach(({commandName: methodName, originalCommandName}) => {
      const fn = {
        [methodName]: function(...args) {
          return instance.executeMethod(exported, originalCommandName || methodName, ...args);
        }
      };

      Object.defineProperty(exported, methodName, {
        value: fn[methodName],
        writable: false,
        enumerable: originalCommandName ? false : true,
        configurable: true
      });
    });

    Object.defineProperty(exported, 'assert', {
      get() {
        return instance.assert;
      },
      enumerable: true,
      configurable: true
    });

		// Make the exported object thenable.
		Object.defineProperty(exported, 'then', {
      value(onFulfilled, onRejected) {
        return instance.then(onFulfilled, onRejected);
      },
      enumerable: false,
      configurable: true
    });

		Object.defineProperty(exported, 'runQueuedCommand', {
      get() {
        return instance.runQueuedCommand.bind(instance);
      },
      enumerable: false,
      configurable: true
    });


		Object.defineProperty(exported, 'runQueuedCommandScoped', {
      get() {
        return instance.runQueuedCommandScoped.bind(instance);
      },
      enumerable: false,
      configurable: true
    });

    Object.defineProperty(exported, 'queueAction', {
      get() {
        return instance.#queueAction.bind(instance);
      },
      enumerable: false,
      configurable: true
    });

    Object.defineProperty(exported, 'createScopedElement', {
      value(selector, parentElement = false) {
        return ScopedWebElement.create(selector, parentElement ? instance.parentScopedElement : instance, instance.nightwatchInstance);
      },
      enumerable: false,
      configurable: false
    });



    return exported;
  }

	/**
	 * @private
	 */
  constructor(selector = 'html', parentElement, nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.parentScopedElement = parentElement;

    this.webElement = this.#createWebElementPromise({
      selector,
      parentElement
    });

  }

  async #findElement({parentElement, condition, index, timeout, retryInterval}) {
    try {
      const webElements = parentElement
        ? await parentElement.webElement.findElements(condition)
        : await this.#driver.wait(until.elementsLocated(condition), timeout, null, retryInterval);

      if (webElements.length === 0) {
        const err = new Error(`The element with a "${condition}" selector is not found.`);
        this.#reporter.registerTestError(err);

        return;
      }

      if (index > webElements.length) {
        const err = new Error(`The index "${index}" is out of bounds for selector "${condition}".`);
        this.#reporter.registerTestError(err);

        return;
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

      if (selector[WEB_ELEMENT_ID] && isFunction(selector.getId)) {
        const webElement = new WebElement(this.#driver, selector.getId());

        return resolve(webElement);
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

  runQueuedCommand(commandName, {scopedValue = false, args = []} = {}) {
    const node = this.#queueAction(commandName, (actions, webElement) => function () {
      if (isFunction(commandName)) {
        return commandName(webElement, ...args).then((result) => {
          node.deferred.resolve(result);
        });
      }

      return actions[commandName](webElement, ...args).then((result) => {
        node.deferred.resolve(result.hasOwnProperty('value') ? result.value : result);
      });
    });

    console.log('runQueuedCommand', commandName, scopedValue);

    if (scopedValue) {
      const instance = ScopedValue.create(node.deferred.promise, this.nightwatchInstance);
      const exported = node.deferred.promise;

      // Object.defineProperty(exported, 'then', {
      //   value(onFulfilled, onRejected) {
      //     return instance.then(onFulfilled, onRejected);
      //   },
      //   enumerable: true,
      //   configurable: true
      // });

      Object.defineProperty(exported, 'map', {
        value(callback) {
          return instance.map(callback);
        },
        enumerable: true,
        configurable: true
      });

      Object.defineProperty(exported, 'assert', {
        get() {
          return instance.assert;
        },
        enumerable: true,
        configurable: true
      });

      Object.defineProperty(exported, 'value', {
        get() {
          return instance.value;
        },
        enumerable: true,
        configurable: false
      });

      return exported;
    }

    return this.#waitFor(node.deferred.promise);
  }

  runQueuedCommandScoped(commandName, ...args) {
    return this.runQueuedCommand(commandName, {scopedValue: true, args});
  }

  #queueAction(name, createAction) {
    const opts = {
      args: [],
      context: null,
      deferred: createPromise(),
      commandFn: createAction(this.nightwatchInstance.transportActions, this.webElement),
      namespace: 'element',
      rejectPromise: true,
      commandName: name
    };

    return this.#queue.add(opts);
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

module.exports.ScopedWebElement = ScopedWebElement;

function createNarrowedError({error, condition, timeout}) {
  return error.name === 'TimeoutError'
    ? new Error(`Timed out while waiting for element "${condition}" to be present for ${timeout} milliseconds.`)
    : error;
}
