const {until, Condition} = require('selenium-webdriver');
const {AssertionRunner} = require('../../assertion');
const {isDefined, format} = require('../../utils');
const {ScopedElementLocator} = require('./element-locator');
const {NoSuchElementError} = require('../../element/locator');

const mapToSeleniumFunction = {
  'selected': until.elementIsSelected,
  'not.selected': until.elementIsNotSelected,
  'visible': until.elementIsVisible,
  'not.visible': until.elementIsNotVisible,
  'enabled': until.elementIsEnabled,
  'not.enabled': until.elementIsDisabled,
  'disabled': until.elementIsDisabled,
  'present': (webElement, scopedElementLocator) => until.elementLocated(scopedElementLocator.condition),
  'not.present': (webElement, scopedElementLocator) => new Condition('until elmenet is not present', (driver) => driver.findElements(scopedElementLocator.condition).then(elements => elements.length ? false : true))
};

/**
 * Waits a given time in milliseconds (default 5000ms) for an element to be in the action state provided before performing any other commands or assertions.
 * If the element fails to be in the action state withing the given time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.conf.js` or in your external globals file.
 * Similarly, the default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * @example
 *  describe('demo Test', function() {
 *   it ('wait for container', async function(browser){
 *     // with default implicit timeout of 5000ms (can be overwritten in settings under 'globals.waitForConditionTimeout')
 *     await browser.element.find('#index-container').waitUntil('visible');
 *
 *     // with explicit timeout (in milliseconds)
 *     await browser.element.find('#index-container').waitUntil('visible', {timeout: 1000});
 *
 *     // continue if failed
 *     await browser.element.find('#index-container').waitUntil('visible', {timeout: 1000, abortOnFailure: false});
 *
 *     // with negative assertion
 *     await browser.element.find('#index-container').waitUntil('not.visible');
 *
 *     // with xpath as the locate strategy
 *     await browser.element.find(by.xpath('//*[@id="index-container"]')).waitUntil('visible', {message: 'The index container is found.'});
 *
 *     // with custom message
 *     await browser.element.find('#index-container').waitUntil('visible', {message: 'The index container is found.'});
 *   });
 *
 *
 *   it('page object demo Test', async function (browser) {
 *     const nightwatchPage = browser.page.nightwatch();
 *
 *     nightwatchPage
 *       .navigate()
 *       .assert.titleContains('Nightwatch.js');
 *
 *     await nightwatchPage.element.find('@featuresList').waitUntil('visible');
 *   });
 * });
 *
 * @method waitUntil
 * @syntax .waitUntil(action, {timeout, retryInterval, message, abortOnFailure});
 * @param {string} action The action state. Should be one of the following: selected, not.selected, visible, not.visible, enabled, disabled, present, not.present
 * @param {number} [timeout] The total number of milliseconds to wait before failing. Can also be set using 'globals.waitForConditionTimeout' under settings.
 * @param {number} [retryInterval] The number of milliseconds to wait between retries. You can use this only if you also specify the time parameter. Can also be set using 'globals.waitForConditionPollInterval' under settings.
 * @param {string} [message] Optional message to be shown in the output. The message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @param {boolean} [abortOnFailure=abortOnAssertionFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 */

class WaitUntil {
  constructor(scopedElement, {action, timeout, retryInterval, message, nightwatchInstance, selector, abortOnFailure}) {
    this.scopedElement = scopedElement;
    this.conditionFn = mapToSeleniumFunction[action];
    this.nightwatchInstance = nightwatchInstance;
    this.action = action;
    this.message = message;
    this.selector = selector;
    this.timeout = timeout || this.nightwatchInstance.settings.globals.waitForConditionTimeout;
    this.retryInterval = retryInterval || this.nightwatchInstance.settings.globals.waitForConditionPollInterval;
    this.abortOnFailure = isDefined(abortOnFailure) ? abortOnFailure : this.nightwatchInstance.settings.globals.abortOnAssertionFailure;
    this.scopedElementLocator = ScopedElementLocator.create(selector, nightwatchInstance);
  }

  createNode() {
    const createAction = (actions, webElementPromise) =>  async function() {

      let result;
      try {

        if (!this.conditionFn) {
          throw new Error(`Invalid action ${this.action} for element.waitUntil command. Possible actions: ${Object.keys(mapToSeleniumFunction).toString()}`);
        }

        const webElement = await webElementPromise;

        if (!webElement && !['present', 'not.present'].includes(this.action)) {
          throw new NoSuchElementError({element: this.scopedElementLocator, abortOnFailure: this.abortOnFailure});
        }

        const elapsedTime = new Date().getTime() - node.startTime;
        const commandResult = await this.scopedElement.driver.wait(this.conditionFn(webElementPromise, this.scopedElementLocator), this.timeout, this.message, this.retryInterval, ()=>{});
        result = await this.pass(commandResult, elapsedTime).catch(err => err);

        return result;
      } catch (err) {
        const elapsedTime = new Date().getTime() - node.startTime;
        const actual = err instanceof NoSuchElementError ? 'not present' : null;
        result = await this.fail(err, actual, elapsedTime).catch(err => err);

        return result;
      } finally {
        node.deferred.resolve(result);
      }
    }.bind(this);

    const node = this.scopedElement.queueAction({name: 'waitUntil', createAction});

    return node;
  }


  async wait() {
    const assertApi = this.nightwatchInstance.api.assert;

    try {
      const node =  this.createNode();

      return this.scopedElement.waitFor(node.deferred.promise);
    } catch (err) {
      assertApi.ok(false, err.message);
    }
  }

  formatMsg(message, timeMs) {
    const defaultMsg = this.message || message;

    return format(defaultMsg, this.selector, timeMs);
  }

  assert({result, passed, err, message, elapsedTime}) {
    const {reporter} = this.scopedElement;

    const runner = new AssertionRunner({abortOnFailure: this.abortOnFailure, passed, err, message, reporter, elapsedTime});

    return runner.run(result);
  }

  pass(result, elapsedTime) {
    const sliceAction = this.action.split('.');
    const expected = sliceAction[0] === 'not' ? `not ${sliceAction[1]}` : this.action;
    const message = this.formatMsg(`Element <%s> was ${expected} in %d milliseconds`, elapsedTime);

    return this.assert({
      result,
      passed: true,
      err: {
        expected
      },
      elapsedTime,
      message
    });
  }

  fail(result, actual, elapsedTime) {
    const sliceAction = this.action.split('.');

    actual = actual ? actual : sliceAction[0] === 'not' ? sliceAction[1] : `not ${this.action}`;
    const expected = sliceAction[0] === 'not' ? `not ${sliceAction[1]}` : this.action;
    const message = this.formatMsg(`Timed out while waiting for element <%s> to be ${expected} for %d milliseconds`, this.timeout);

    return this.assert({
      result,
      passed: false,
      message,
      err: {
        actual,
        expected
      },
      elapsedTime
    });
  }
}

module.exports = WaitUntil;
