const {until, WebElement} = require('selenium-webdriver');
const Utils = require('../../utils');
const {Logger, isUndefined, isObject, isString, isFunction} = Utils;
const isDefined = function(val) {
  return !isUndefined(val);
};
const Element = require('../../element');
const {Locator} = Element;

class ElementGlobal {
  static get availableElementCommands() {
    return [
      'getId',
      'findElement',
      'findElements',
      'click',
      'sendKeys',
      'getTagName',
      'getCssValue',
      'getAttribute',
      'getProperty',
      'getText',
      'getAriaRole',
      'getAccessibleName',
      'getRect',
      'isEnabled',
      'isSelected',
      'submit',
      'clear',
      'isDisplayed',
      'takeScreenshot'
    ];
  }

  static element({locator, testSuite, client}) {
    const instance = new ElementGlobal({testSuite, client});
    instance.setLocator(locator);

    return instance.exported();
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get commandQueue() {
    return this.nightwatchInstance.queue;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get settings() {
    return this.client ? this.client.settings : this.testSuite.settings;
  }

  constructor({testSuite, client}) {
    this.testSuite = testSuite;
    this.client = client;
    this.suppressNotFoundErrors = false;
    this.abortOnFailure = this.settings.globals.abortOnElementLocateError;
    this.timeout = this.settings.globals.waitForConditionTimeout;
    this.retryInterval = this.settings.globals.waitForConditionPollInterval;
    this.init();
  }

  init() {
    this.nightwatchInstance = this.testSuite && this.testSuite.client ? this.testSuite.client : this.client;
  }

  async findElement() {
    if (this.element) {
      return;
    }

    let {locator} = this;
    if ((locator instanceof Element) && locator.resolvedElement) {
      this.element = this.createWebElement(locator.resolvedElement);

      return;
    }

    this.element = await this.transport.driver.wait(until.elementLocated(locator), this.timeout, null, this.retryInterval);
  }

  static isElementObject(element) {
    if (!isObject(element)) {
      return false;
    }

    if (!isString(element.selector)) {
      return false;
    }

    const {
      abortOnFailure, retryInterval, timeout, suppressNotFoundErrors, index
    } = element;

    return isDefined(abortOnFailure) || isDefined(retryInterval) || isDefined(timeout) || isDefined(suppressNotFoundErrors) || isDefined(index);
  }

  setPropertiesFromElement(element) {
    const {
      abortOnFailure, retryInterval, timeout, suppressNotFoundErrors, index
    } = element;

    if (isDefined(index)) {
      this.index = index;
    }

    if (isDefined(abortOnFailure)) {
      this.abortOnFailure = abortOnFailure;
    }

    if (isDefined(suppressNotFoundErrors)) {
      this.suppressNotFoundErrors = suppressNotFoundErrors;
    }

    if (isDefined(retryInterval)) {
      this.retryInterval = retryInterval;
    }

    if (isDefined(timeout)) {
      this.timeout = timeout;
    }
  }

  createWebElement(id) {
    return new WebElement(this.transport.driver, id);
  }

  setLocator(locator) {
    if (WebElement.isId(locator)) {
      this.element = this.createWebElement(WebElement.extractId(locator));

      return;
    }

    if (locator instanceof WebElement) {
      this.element = locator;

      return;
    }

    if (ElementGlobal.isElementObject(locator)) {
      locator = Element.createFromSelector(locator);
    }

    if (locator instanceof Element) {
      this.locator = locator;
    } else {
      this.locator = Locator.create(locator);
    }
  }

  exported() {
    const exportedElement = Element.createFromSelector(this.locator || this.element);

    this.loadCommandsOntoObject(exportedElement);

    return exportedElement;
  }

  computeArguments(args, commandName) {
    if (args.length === 0) {
      return args;
    }

    if (['findElements', 'findElement'].includes(commandName)) {
      if (isString(args[0])) {
        args[0] = {
          value: args[0],
          using: 'css selector'
        };
      } else if (isObject(args[0]) && args[0].selector) {
        if (args[0] instanceof Element || ElementGlobal.isElementObject(args[0])) {
          this.setPropertiesFromElement(args[0]);
        }

        args[0] = Locator.create(args[0]);
      }
    }

    return args;
  }

  createCommand(commandName, commandToExecute) {
    return function executeFn(...args) {
      const deferred = Utils.createPromise();
      const stackTrace = Utils.getOriginalStackTrace(executeFn);

      this.init();

      const {api, commandQueue, nightwatchInstance} = this;
      const commandFn = async () => {
        const isElement = await this.setElement(stackTrace);
        if (!isElement) {
          return null;
        }

        if (commandName === 'findElement' && args.length === 0) {
          return this.element;
        }

        args = this.computeArguments(args, commandName);
        let value;
        let error;

        try {
          value = await this.element[commandName].apply(this.element, args);
        } catch (err) {
          error = err;
        }

        const lastArg = args[args.length-1];
        if (isFunction(lastArg)) {
          if (error) {
            return lastArg.call(this.api, {
              value,
              error,
              status: 0
            });
          }

          const callbackResult = lastArg.call(this.api, {
            value,
            status: 0
          });

          if (isDefined(callbackResult)) {
            return callbackResult;
          }
        }

        if (error) {
          throw error;
        }

        return value;
      };

      let isES6Async = nightwatchInstance.settings.always_async_commands;

      if (!isES6Async) {
        isES6Async = nightwatchInstance.isES6AsyncTestcase;
      }

      if (!Utils.isUndefined(nightwatchInstance.isES6AsyncTestHook)) {
        isES6Async = nightwatchInstance.isES6AsyncTestHook;
      }
      //isES6Async = true;
      const node = commandQueue.add({
        commandName: `element().${commandName}`,
        commandFn: commandToExecute ? commandToExecute({stackTrace}) : commandFn,
        context: api,
        args,
        stackTrace,
        namespace: null,
        deferred,
        isES6Async
      });

      if (isES6Async) {
        Object.assign(node.deferred.promise, api);

        return node.deferred.promise;
      }

      return api;
    }.bind(this);
  }

  async setElement(stackTrace) {
    try {
      await this.findElement();

      return true;
    } catch (err) {
      if (this.suppressNotFoundErrors) {
        return null;
      }

      err.stack = stackTrace;
      Logger.error(err);

      if (this.abortOnFailure) {
        this.reporter.registerTestError(err);
      }

      return null;
    }
  }

  loadCommandsOntoObject(exportedElement) {
    ElementGlobal.availableElementCommands.forEach(commandName => {
      Object.defineProperty(exportedElement, commandName, {
        value: this.createCommand.call(this, commandName),
        writable: false
      });
    });

    Object.defineProperty(exportedElement, 'getWebElement', {
      value: this.createCommand.call(this, 'getWebElement', ({stackTrace}) => {
        return async () => {
          const isElement = await this.setElement(stackTrace);
          if (!isElement) {
            return null;
          }

          return this.element;
        };
      }),
      writable: false
    });

    return this;
  }
}

module.exports = ElementGlobal;
