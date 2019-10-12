const WaitForDisplayed = require('./_waitForDisplayed.js');

/**
 * Opposite of `waitForElementVisible`. Waits a given time in milliseconds (default 5000ms) for an element to be not visible (i.e. hidden but existing) in the page before performing any other commands or assertions.
 * If the element fails to be hidden in the specified amount of time, the test fails.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     // with default implicit timeout of 5000ms (can be overwritten in settings under 'globals.waitForConditionTimeout')
 *     browser.waitForElementNotVisible('#dialog');
 *
 *     // specify the locate strategy (css selector/xpath) as the first argument
 *     browser.waitForElementNotVisible('css selector', '#dialog');
 *
 *     // with explicit timeout (in milliseconds)
 *     browser.waitForElementNotVisible('#dialog', 1000);
 *
 *     // continue if failed
 *     browser.waitForElementNotVisible('#dialog', 1000, false);
 *
 *     // with callback
 *     browser.waitForElementNotVisible('#dialog', 1000, function() {
 *       // do something while we're here
 *     });
 *
 *     // with custom output message - the locate strategy is required
 *     browser.waitForElementNotVisible('css selector', '#dialog', 'The dialog container is not visible.');
 *
 *     // with custom Spanish message
 *     browser.waitForElementNotVisible('#dialog', 1000, 'elemento %s no era visible en %d ms');
 *
 *     // many combinations possible - the message is always the last argument
 *     browser.waitForElementNotVisible('#dialog', 1000, false, function() {}, 'elemento %s no era visible en %d ms');
 *   },
 *
 *   'demo Test with selector objects': function(browser) {
 *      browser.waitForElementNotVisible({
 *        selector: '#dialog',
 *        timeout: 1000
 *      });
 *
 *      browser.waitForElementNotVisible({
 *        selector: '#dialog',
 *        locateStrategy: 'css selector'
 *      }, 'Custom output message');
 *
 *      browser.waitForElementNotVisible({
 *        selector: '.container',
 *        index: 2,
 *        retryInterval: 100,
 *        abortOnFailure: true
 *      });
 *   }
 *
 *   'page object demo Test': function (browser) {
 *      var nightwatch = browser.page.nightwatch();
 *      nightwatch
 *        .navigate()
 *        .assert.titleContains('Nightwatch.js');
 *
 *      nightwatch.api.waitForElementNotVisible('@mainDialog', function(result) {
 *        console.log(result);
 *      });
 *   }
 * }
 *
 * @syntax .waitForElementNotVisible([using], selector, [timeout], [pollInterval], [abortOnAssertionFailure], [callback], [message]);
 * @method waitForElementNotVisible
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {number} [time=waitForConditionTimeout] The total number of milliseconds to wait before failing.
 * @param {number} [poll=waitForConditionPollInterval] The number of milliseconds to wait between checks. You can use this only if you also specify the time parameter.
 * @param {boolean} [abortOnFailure=abortOnAssertionFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @see waitForElementVisible
 * @sortIndex 30
 * @api protocol.waitforelements
 */
class WaitForElementNotVisible extends WaitForDisplayed {
  constructor(opts) {
    super(opts);

    this.expectedValue = 'not visible';
  }

  shouldRetryAction(elementVisible) {
    return elementVisible;
  }

  elementVisible(response) {
    let defaultMsg = 'Timed out while waiting for element <%s> to not be visible for %d milliseconds.';

    return this.fail(response, 'visible', this.expectedValue, defaultMsg);
  }

  elementNotVisible(response) {
    let defaultMsg = 'Element <%s> was not visible after %d milliseconds.';

    return this.pass(response, defaultMsg, this.executor.elapsedTime);
  }

}

module.exports = WaitForElementNotVisible;
