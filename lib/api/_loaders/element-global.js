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
      ['findElement', 'element', 'find', 'get'],
      ['findElements', 'findAll'],
      'click',
      'sendKeys',
      ['getTagName', 'tagName'],
      ['getCssValue', 'css'],
      ['getAttribute', 'attr', 'attribute'],
      ['getProperty', 'property', 'prop'],
      ['getText', 'text'],
      ['getAriaRole', 'ariaRole'],
      ['getAccessibleName', 'accessibleName'],
      ['getRect', 'rect'],
      'isEnabled',
      'isSelected',
      'submit',
      'clear',
      'isDisplayed',
      ['takeScreenshot', 'screenshot']
    ];
  }

  static element({locator, testSuite, client, options}) {
    const instance = new ElementGlobal({testSuite, client, options});
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

  constructor({testSuite, client, options = {}}) {
    this.testSuite = testSuite;
    this.client = client;
    this.isComponent = options.isComponent || false;
    this.componentType = this.isComponent && options.type;
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

    const {locator} = this;
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
      let value;
      if (isString(locator) && this.client && this.client.locateStrategy) {
        value = {
          value: locator,
          using: this.client.locateStrategy
        };
      } else {
        value = locator;
      }

      this.locator = Locator.create(value);
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

  getComponentProperty(propName) {
    return this.client.transportActions.executeScript(function(property) {
      // eslint-disable-next-line
      if (!window['@@component_element']) {
        throw new Error('Component was not rendered.');
      }
      // eslint-disable-next-line
      if (window['@@component_element'].componentVM) {
        // eslint-disable-next-line
        return window['@@component_element'].componentVM[property];
      }
      // eslint-disable-next-line
      return window['@@component_element'][property];
    }, [propName]).then(result => {
      if (result.error instanceof Error) {
        throw result.error;
      }

      return result.value;
    });
  }

  createCommand(commandName, commandToExecute, nightwatchName) {
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
          if (['getProperty', 'property', 'prop'].includes(nightwatchName)  && this.isComponent && this.componentType) {
            value = await this.getComponentProperty(args[0]);
          } else {
            value = await this.element[commandName].apply(this.element, args);
          }
        } catch (err) {
          error = err;
        }

        if (['find', 'get', 'element'].includes(nightwatchName) && (value instanceof WebElement)) {
          value = ElementGlobal.element({locator: value, client: nightwatchInstance});
        } else if (nightwatchName === 'findAll') {
          value = value.map(element => {
            if (element instanceof WebElement) {
              return ElementGlobal.element({locator: element, client: nightwatchInstance});
            }

            return element;
          });
        }

        const lastArg = args[args.length - 1];
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

        if (['find', 'get', 'element'].includes(nightwatchName) && error) {
          return null;
        }

        if (error) {
          throw error;
        }

        return value;
      };

      const isES6Async = true;
      const node = commandQueue.add({
        commandName: `element().${nightwatchName}`,
        commandFn: commandToExecute ? commandToExecute({stackTrace}) : commandFn,
        context: api,
        args,
        stackTrace,
        namespace: null,
        alwaysResolvePromise: true,
        rejectPromise: true,
        deferred,
        isES6Async
      });

      Object.assign(node.deferred.promise, api);
      if (commandName === 'findElement') {
        node.deferred.promise['@nightwatch_element'] = true;
        node.deferred.promise['@nightwatch_args'] = args;
        if (this.isComponent) {
          node.deferred.promise['@nightwatch_component'] = true;
        }
      } else if (commandName === 'findElements') {
        node.deferred.promise['@nightwatch_multiple_elements'] = true;
      }

      return node.deferred.promise;
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
      let names = commandName;
      if (!Array.isArray(names)) {
        names = [names];
      }
      const seleniumName = names[0];

      names.forEach(commandName => {
        Object.defineProperty(exportedElement, commandName, {
          value: this.createCommand.call(this, seleniumName, null, commandName),
          writable: false
        });
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

    if (this.isComponent) {
      Object.defineProperty(exportedElement, 'isComponent', {
        value: this.isComponent,
        writable: false
      });
    }

    return this;
  }
}

module.exports = ElementGlobal;
