const Element = require('../../element');
const {isFunction, isString, makePromise} = require('../../utils');
const {By} = require('selenium-webdriver');
const {LocateStrategy} = Element;

module.exports = class ProtocolAction {
  static get ScreenOrientation() {
    return ['LANDSCAPE', 'PORTRAIT'];
  }

  static get MouseButton() {
    return {
      LEFT: 'left',
      MIDDLE: 'middle',
      RIGHT: 'right'
    };
  }

  static validateElementId(id, apiMethod) {
    if (!isString(id)) {
      const err = new Error(`First argument passed to .${apiMethod}() should be a web element ID string. Received ${typeof id}.`);
      err.detailedErr = `See https://nightwatchjs.org/api/${apiMethod}.html\n`;
      throw err;
    }
  }

  static get elementCommandToActionMap() {
    return {
      element: {
        transportAction: 'locateSingleElement',
        returnSingleElement: true
      },
      elements: {
        transportAction: 'locateMultipleElements',
        returnSingleElement: false
      },
      elementIdElement: {
        transportAction: 'locateSingleElementByElementId',
        returnSingleElement: true
      },
      elementIdElements: {
        transportAction: 'locateMultipleElementsByElementId',
        returnSingleElement: false
      },
      findElement: {
        transportAction: 'locateMultipleElements',
        returnSingleElement: true
      },
      findElements: {
        transportAction: 'locateMultipleElements',
        returnSingleElement: false
      }
    };
  }

  reportProtocolErrors(result) {
    return !(result && (result.error instanceof Error) && result.error.registered);
  }

  get elementLocator() {
    return this.client.elementLocator;
  }

  get transport() {
    return this.client.transport;
  }

  get requiresSeleniumWebdriver() {
    return false;
  }

  get settings() {
    return this.client.settings;
  }

  /**
   * @type {Nightwatch}
   * @return {*}
   */
  get client() {
    return this.__nightwatchInstance;
  }

  get api() {
    return this.client.api;
  }

  constructor(nightwatchInstance) {
    this.__nightwatchInstance = nightwatchInstance;
  }

  /*!
   * @override
   * @return {Promise}
   */
  async command() {}

  /*!
   *
   * @param {Element} [element]
   * @param {Element} [parentElement]
   * @param {String} [id]
   * @param {String} using
   * @param {String} value
   * @param {function} [callback]
   *
   * @return {Promise}
   */
  findElements({element, parentElement, id, using, value, commandName, callback = function(r) {return r}}) {
    if (!(element instanceof Element) && !(element instanceof By)) {
      try {
        element = Element.createFromSelector(value, using);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if ((element instanceof Element) && !element.usingRecursion) {
      LocateStrategy.validate(element.locateStrategy, commandName);
    }

    return this.locate({id, element, parentElement, commandName})
      .then(result => {
        if (commandName !== 'element' && result && (result.error instanceof Error) && result.error.name === 'NoSuchElementError') {
          result = {
            value: [],
            status: 0
          };
        }

        return makePromise(callback, this.api, [result]);
      });
  }

  /*!
   *
   * @param {Element} element
   * @param {string} protocolCommand either "elements"(multiple) or "element"(single)
   */
  async locate({id, element, parentElement, commandName}) {
    const {transportAction, returnSingleElement} = ProtocolAction.elementCommandToActionMap[commandName];

    if ((element instanceof Element) && element.usingRecursion) {
      return this.elementLocator.findElement({element, transportAction, returnSingleElement});
    }

    if (parentElement) {
      let elementResponse = await this.elementLocator.findElement({element: parentElement});
      if (!elementResponse.value) {
        return {
          value: null,
          status: -1,
          err: new Error(`No element found for ${parentElement}.`)
        };
      }

      id = this.transport.getElementId(elementResponse.value);
    }

    return this.elementLocator.executeProtocolAction({id, element, transportAction, commandName});
  }

  /*!
   * Helper function for execute and execute_async
   *
   * @param {string} path
   * @param {string|function} script
   * @param {Array} args
   * @param {function} callback
   * @private
   */
  executeScriptHandler(method, script, args, callback) {
    let fn;

    if (script.originalTarget) {
      script = script.originalTarget;
    }

    if (isFunction(script)) {
      fn = 'var passedArgs = Array.prototype.slice.call(arguments,0); return (' +
        script.toString() + ').apply(window, passedArgs);';
    } else {
      fn = script;
    }

    if (arguments.length === 2) {
      args = [];
    } else if (arguments.length === 3 && isFunction(arguments[2])) {
      callback = arguments[2];
      args = [];
    }

    return this.transportActions[method](fn, args, callback);
  }

  /*!
   * Helper function for mouseButton actions
   *
   * @param {string} handler
   * @param {string|number} button
   * @param {function} callback
   * @private
   */
  mouseButtonHandler(handler, button, callback) {
    let buttonIndex;

    if (button === undefined && callback === undefined) {
      button = 0;
    } else {
      if (isFunction(button)) {
        callback = button;
        button = 0;
      }

      if (isString(button)) {
        buttonIndex = [
          ProtocolAction.MouseButton.LEFT,
          ProtocolAction.MouseButton.MIDDLE,
          ProtocolAction.MouseButton.RIGHT
        ].indexOf(button.toLowerCase());

        if (buttonIndex !== -1) {
          button = buttonIndex;
        }
      }
    }

    return this.transportActions[handler](button, callback);
  }
};
