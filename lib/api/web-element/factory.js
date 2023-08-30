const ScopedWebElements = require('./scoped-elements.js');
const ScopedWebElement = require('./scoped-element.js');
const ScopedElementAssertions = require('./assert/element-assertions.js');
const WaitUntil = require('./waitUntil.js');

const Element = require('../../element');
const ScopedValueAssertions = require('./assert/value-assertions.js');
const ScopedValue = require('./element-value.js');

const throwError = (message, commandName) => {
  const error = new Error(`Error in ${commandName}(): ${message}`);

  return error;
};

const createScopedWebElement = function(selector, parentElement, nightwatchInstance) {
  const instance = new ScopedWebElement(selector, parentElement, nightwatchInstance);
  const exported = selector ? Element.createFromSelector(selector) : {};

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
      enumerable: !originalCommandName,
      configurable: true
    });
  });

  Object.defineProperty(exported, 'assert', {
    get() {
      return ScopedElementAssertions.create(instance, {
        negated: false,
        nightwatchInstance
      });
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(exported, 'waitUntil', {
    value(actionOrOptions, opts = {}) {
      return createScopedWebElement(new Promise(function (resolve, reject) {
        const args = Object.assign({}, opts);

        if (typeof actionOrOptions === 'string') {
          args.action = actionOrOptions;
        } else if (actionOrOptions && typeof actionOrOptions === 'object') {
          Object.assign(args, actionOrOptions);
        }

        const waitUntil = new WaitUntil(instance, {
          selector,
          nightwatchInstance,
          ...args
        });

        return waitUntil.wait().then(element => resolve(element));
      }.bind(instance)), parentElement, nightwatchInstance);
    }

  });

  Object.defineProperty(exported, 'then', {
    value(onFulfilled, onRejected) {
      return instance.then(onFulfilled, onRejected);
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(exported, 'webElement', {
    get() {
      return instance.webElement;
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(exported, 'runQueuedCommand', {
    value(...args) {
      return instance.runQueuedCommand(...args);
    },
    enumerable: false,
    configurable: true
  });

  Object.defineProperty(exported, 'createRootElementCommand', {
    value(...args) {
      return instance.createRootElementCommand(...args);
    },
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(exported, 'runQueuedCommandScoped', {
    value(commandName, ...args) {
      const node = instance.createNode(commandName, args);

      return createScopedValue(node, nightwatchInstance);
    },
    enumerable: false,
    configurable: true
  });

  Object.defineProperty(exported, 'queueAction', {
    get() {
      return instance.queueAction.bind(instance);
    },
    enumerable: false,
    configurable: true
  });

  Object.defineProperty(exported, 'createScopedElement', {
    value(selector, parentElement = false) {
      return createScopedWebElement.call(
        instance,
        selector,
        parentElement ? parentElement : null,
        instance.nightwatchInstance
      );
    },
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(exported, 'createScopedElements', {
    value(selector, {commandName, parentElement = false} = {}) {
      return createScopedWebElements.call(instance, commandName, selector, parentElement ? parentElement : null, instance.nightwatchInstance);
    },
    enumerable: false,
    configurable: false
  });

  return exported;
};

const createScopedWebElements = function(commandName, selector, parentElement, nightwatchInstance) {
  const instance = new ScopedWebElements(selector, parentElement, nightwatchInstance);
  const createAction = () => function({args}) {
    const elms = args[0];

    return elms.then(elements => elements.map(el => createScopedWebElement(el, parentElement, nightwatchInstance)));
  };

  const node = this.queueAction({name: commandName, args: [instance], createAction, namespace: 'element'});
  node.printArgs = function() {
    return `{ ${selector} }`;
  };

  const exported = {};

  Object.defineProperty(exported, 'then', {
    value(onFulfilled, onRejected) {
      return instance.then(onFulfilled, onRejected);
    },
    enumerable: false,
    configurable: true
  });

  Object.defineProperty(exported, 'count', {
    value() {
      return createScopedValue({
        deferred: {
          promise: instance.then((elements) => elements.length)
        }
      }, nightwatchInstance);
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(exported, 'nth', {
    value(index = 0) {
      return createScopedWebElement(new Promise(function (resolve, reject) {
        this.then((elements) => {
          if (elements.length === 0) {
            return reject(throwError(`No elements found for selector: ${selector}`, 'nth'));
          }

          if (index < 0 || index >= elements.length) {
            return reject(throwError(`Index ${index} out of bounds for selector: ${selector}`, 'nth'));
          }

          resolve(elements[index]);
        });
      }.bind(instance)), parentElement, nightwatchInstance);
    },
    enumerable: true,
    configurable: true
  });

  // Object.defineProperty(exported, 'assert', {
  //   get() {
  //     return new ScopedElementsAssertions(instance, {
  //       negated: false,
  //       nightwatchInstance
  //     });
  //   },
  //   enumerable: false,
  //   configurable: true
  // });

  return exported;
};

const createScopedValue = function(node, nightwatchInstance) {
  const instance = ScopedValue.create(node.deferred.promise, nightwatchInstance);
  const exported = {};

  Object.defineProperty(exported, 'then', {
    value(onFulfilled, onRejected) {
      return instance.then(onFulfilled, onRejected);
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(exported, 'map', {
    value(callback) {
      return instance.map(callback);
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(exported, 'assert', {
    get() {
      return ScopedValueAssertions.create(instance, {
        negated: false,
        nightwatchInstance
      });
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
};

module.exports.createScopedWebElements = createScopedWebElements;
module.exports.create = createScopedWebElement;
module.exports.createScopedValue = createScopedValue;
