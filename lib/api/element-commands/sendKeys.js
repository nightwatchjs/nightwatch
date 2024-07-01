const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Types a key sequence on the DOM element. Can be used to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
 *
 *
 * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
 *
 * @example
 * // send some simple text to an input
 * this.demoTest = function (browser) {
 *   browser.sendKeys('input[type=text]', 'nightwatch');
 * };
 * //
 * // send some text to an input and hit enter.
 * this.demoTest = function (browser) {
 *   browser.sendKeys('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
 * };
 *
 *
 * @link /session/:sessionId/element/:id/value
 * @method sendKeys
 * @syntax .sendKeys(selector, inputValue, [callback])
 * @syntax browser.element(selector).sendKeys(...keys)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string|array} inputValue The text to send to the element or key strokes.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#sendKeys
 * @api protocol.elementinteraction
 */
class SendKeys extends BaseElementCommand {
  static get isTraceable() {
    return true;
  }

  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'sendKeysToElement';
  }
}

module.exports = SendKeys;
