const until = require('selenium-webdriver/lib/until');
const {AssertionRunner} = require('../../assertion');
const {isDefined, format} = require('../../utils');

const mapToSeleniumFunction = {
  'selected': until.elementIsSelected,
  'not.selected': until.elementIsNotSelected,
  'visible': until.elementIsVisible,
  'not.visible': until.elementIsNotVisible,
  'enabled': until.elementIsEnabled,
  'not.enabled': until.elementIsDisabled,
  'disabled': until.elementIsDisabled
};

/**
 * Waits a given time in milliseconds (default 5000ms) for an element to be present in a specified state in the page before performing any other commands or assertions.
 * If the element fails to be present in the specified state within the given time, the test fails. You can change this by setting `abortOnFailure` to `false`.
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
 * @param {string} action The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
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
  }

  createNode() {
    const createAction = (actions, webElement) =>  function() {
      if (!this.conditionFn) {
        throw new Error(`Invalid action ${this.action} for element.waitUntil command. Possible actions: ${Object.keys(mapToSeleniumFunction).toString()}`);
      }

      return actions.wait(this.conditionFn(webElement), this.timeout, this.message, this.retryInterval, ()=>{})
        .then(result => {
          const elapsedTime = new Date().getTime() - node.startTime;
          if (result.error) {
            const actual = result.error.name === 'NightwatchElementError' ? 'not found' : null;

            return this.fail(result, actual, elapsedTime);
          }

          return this.pass(result, elapsedTime);
        })
        .catch(err => err)
        .then(result => {
          node.deferred.resolve(result);

          return result;
        });
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
