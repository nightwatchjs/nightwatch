const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Sends some text to an element. Can be used to set the value of a form element or to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
 *
 * <div class="alert alert-warning"><strong>setValue</strong> does not clear the existing value of the element. To do so, use the <strong>clearValue()</strong> command.</div>
 *
 * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
 *
 * @example
 * // send some simple text to an input
 * this.demoTest = function (browser) {
 *   browser.setValue('input[type=text]', 'nightwatch');
 * };
 * //
 * // send some text to an input and hit enter.
 * this.demoTest = function (browser) {
 *   browser.setValue('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
 * };
 *
 *
 * @link /session/:sessionId/element/:id/value
 * @method setValue
 * @syntax .setValue(selector, inputValue, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string|array} inputValue The text to send to the element or key strokes.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#element-send-keys
 * @api protocol.elementinteraction
 */
class SetValue extends BaseElementCommand {
  static get AliasName() {
    return 'sendKeys';
  }

  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'setElementValue';
  }
}

module.exports = SetValue;
