const {until} = require('selenium-webdriver');

const {Logger} = require('../../utils');
const ScopedElementNamespace = require('./index.js');
const {ScopedValue} = require('./element-value.js');
const {ScopedElementsAssertions} = require('./assert/elements-assertions.js');
const {ScopedElementLocator} = require('./element-locator.js');

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
    } = ScopedElementLocator.create(selector, nightwatchInstance);

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

          resolve(webElements.map(element => new ScopedElementNamespace.ScopedWebElement(element, parentScopedElement, nightwatchInstance)));
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

          Logger.error(narrowedError);

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
