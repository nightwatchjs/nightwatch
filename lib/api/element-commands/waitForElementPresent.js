const WaitForElement = require('./_waitFor.js');

/**
 * Waits a given time in milliseconds (default 5000ms) for an element to be present in the page before performing any other commands or assertions.
 * If the element fails to be present in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 * Similarly, the default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     // with default implicit timeout of 5000ms (can be overwritten in settings under 'globals.waitForConditionTimeout')
 *     browser.waitForElementPresent('#index-container');
 *
 *     // specify the locate strategy (css selector/xpath) as the first argument
 *     browser.waitForElementPresent('css selector', '#index-container');
 *
 *     // with explicit timeout (in milliseconds)
 *     browser.waitForElementPresent('#index-container', 1000);
 *
 *     // continue if failed
 *     browser.waitForElementPresent('#index-container', 1000, false);
 *
 *     // with callback
 *     browser.waitForElementPresent('#index-container', 1000, function() {
 *       // do something while we're here
 *     });
 *
 *     // with custom output message - the locate strategy is required
 *     browser.waitForElementPresent('css selector', '#index-container', 'The index container is found.');
 *
 *     // with custom Spanish message
 *     browser.waitForElementPresent('#index-container', 1000, 'elemento %s no era presente en %d ms');
 *
 *     // many combinations possible - the message is always the last argument
 *     browser.waitForElementPresent('#index-container', 1000, false, function() {}, 'elemento %s no era presente en %d ms');
 *   },
 *
 *   'demo Test with selector objects': function(browser) {
 *      browser.waitForElementPresent({
 *        selector: '#index-container',
 *        timeout: 1000
 *      });
 *
 *      browser.waitForElementPresent({
 *        selector: '#index-container',
 *        locateStrategy: 'css selector'
 *      }, 'Custom output message');
 *
 *      browser.waitForElementPresent({
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
 *      nightwatch.waitForElementPresent('@featuresList', function(result) {
 *        console.log(result);
 *      });
 *   }
 * }
 *
 * @method waitForElementPresent
 * @syntax .waitForElementPresent([using], selector, [timeout], [pollInterval], [abortOnAssertionFailure], [callback], [message]);
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {number} [time=waitForConditionTimeout] The total number of milliseconds to wait before failing.
 * @param {number} [poll=waitForConditionPollInterval] The number of milliseconds to wait between checks. You can use this only if you also specify the time parameter.
 * @param {boolean} [abortOnFailure=abortOnAssertionFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @sortIndex 0
 * @api protocol.waitforelements
 */
class WaitForElementPresent extends WaitForElement {
  get retryOnSuccess() {
    return false;
  }

  elementFound(result) {
    const defaultMsg = 'Element <%s> was present after %d milliseconds.';

    return this.pass(result, defaultMsg, this.executor.elapsedTime);
  }
}

module.exports = WaitForElementPresent;
