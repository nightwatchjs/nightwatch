const {WebElement} = require('selenium-webdriver');

class ScopedElementAssertions {
  constructor(scopedElement, {negated, nightwatchInstance}) {
    this.negated = negated;
    this.scopedElement = scopedElement;
    this.nightwatchInstance = nightwatchInstance;
  }

  assert(callback) {
    // The below promise is returned to the test case by the assertion, so
    // it should fail in case the actual assertion (callback) fails. In case
    // of a sync test, the actual assertion would never fail, so we always
    // resolve the promise.
    const assertPromise = new Promise((resolve, reject) => {
      const assert = this.nightwatchInstance.api.assert;

      const callbackResult = callback(this.negated ? assert.not : assert, this.scopedElement.webElement);
      if (callbackResult instanceof Promise) {
        callbackResult
          .then(() => {
            resolve(this.scopedElement);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve(this.scopedElement);
      }
    });

    // prevent unhandledRejection errors, while also making sure
    // that the exception/failure passes to the actual test case.
    assertPromise.catch(() => {});

    return assertPromise;
  }

  async executeScript(scriptFn, args) {
    return this.nightwatchInstance.transportActions.executeScript(scriptFn, [this.scopedElement.webElement, ...args]).then(({value}) => value);
  }
}

module.exports.create = function createAssertions(scopedElement, {negated = false, nightwatchInstance}) {
  const instance = new ScopedElementAssertions(scopedElement, {
    negated,
    nightwatchInstance
  });

  const exported = {};
  Object.defineProperty(exported, 'not', {
    get() {
      return createAssertions(scopedElement, {
        negated: true,
        nightwatchInstance
      });
    }
  });

  Object.defineProperties(exported, {
    enabled: {
      value(message) {
        return instance.assert((assertApi, element) => assertApi.enabled(element, message));
      },
      enumerable: true,
      configurable: false
    },
    selected: {
      value(message) {
        return instance.assert((assertApi, element) => assertApi.selected(element, message));
      },
      enumerable: true,
      configurable: false
    },
    visible: {
      value(message) {
        return instance.assert((assertApi, element) => assertApi.visible(element, message));
      },
      enumerable: true,
      configurable: false
    },
    hasDescendants: {
      value(message) {
        return instance.assert((assertApi, element) => assertApi.hasDescendants(element, message));
      },
      enumerable: true,
      configurable: false
    },
    present: {
      value(message) {
        return instance.assert(async (assertApi, element) => {
          const el = await element;
          const id = await el.getId();

          return assertApi.ok(el instanceof WebElement, message || `Testing if the element <WebElement: ${id}> is present.`);
        });
      },
      enumerable: true,
      configurable: false
    },
    hasClass: {
      async value(name, message = `Testing if the element has "${name}" class.`) {
        const result = await instance.executeScript(function(element, className) {
          return element.classList.contains(className);
        }, [name]);

        return instance.assert((assertApi) => assertApi.ok(result, message));
      },
      enumerable: true,
      configurable: false
    },

    hasAttribute: {
      async value(name, message = `Testing if the element has "${name}" attribute.`) {
        const result = await instance.executeScript(function(element, attributeName) {
          return element.hasAttribute(attributeName);
        }, [name]);

        return instance.assert((assertApi) => assertApi.ok(result, message));
      },
      enumerable: true,
      configurable: false
    },

    customScript: {
      async value(scriptFn = function(el) {return el}, args = [], message = '') {
        const result = await instance.executeScript(scriptFn, args);

        return instance.assert((assertApi) => assertApi.ok(result, message));
      },
      enumerable: true,
      configurable: false
    }
  });

  return exported;
};
