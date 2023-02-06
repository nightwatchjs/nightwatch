const { until } = require('selenium-webdriver');

const Utils = require('../utils/index.js');
const ScopedElementNamespace = require('./scoped-element.js');
const { ScopedValue } = require('./scoped-value.js');
const { ScopedElementLocator } = require('./scoped-element-locator.js');

class ScopedElements {
  constructor(selector, parentScopedElement, nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.parentScopedElement = parentScopedElement;

    const {
      timeout,
      condition,
      retryInterval,
      abortOnFailure,
      suppressNotFoundErrors
    } = new ScopedElementLocator(selector, nightwatchInstance);

    this.webElements = new Promise(async (resolve, reject) => {
      if (selector instanceof Promise) {
        try {
          selector = await selector;
        } catch (error) {
          return reject(error);
        }
      }
      if (Array.isArray(selector)) {
        resolve(selector);
      } else {
        try {
          const webElements = parentScopedElement
            ? await parentScopedElement.webElement.findElements(condition)
            : await nightwatchInstance.transport.driver.wait(
                until.elementsLocated(condition),
                timeout,
                null,
                retryInterval
              );

          resolve(
            webElements.map(
              (element) =>
                new ScopedElementNamespace.ScopedElement(
                  element,
                  parentScopedElement,
                  nightwatchInstance
                )
            )
          );
        } catch (error) {
          if (suppressNotFoundErrors) {
            return resolve([]);
          }

          const narrowedError =
            error.name === 'TimeoutError'
              ? new Error(
                  `Timed out while waiting for elements "${condition}" to be present for ${timeout} milliseconds.`
                )
              : error;

          Utils.Logger.error(narrowedError);

          if (abortOnFailure) {
            nightwatchInstance.reporter.registerTestError(narrowedError);

            reject(narrowedError);
          } else {
            resolve([]);
          }
        }
      }
    });
  }

  then(onFulfilled, onRejected) {
    return this.webElements.then(onFulfilled, onRejected);
  }

  get assert() {
    return new ScopedElementsAssertions(this, {
      negated: false,
      nightwatchInstance: this.nightwatchInstance
    });
  }

  count() {
    return new ScopedValue(
      this.then((elements) => elements.length),
      this.nightwatchInstance
    );
  }
}

exports.ScopedElements = ScopedElements;
