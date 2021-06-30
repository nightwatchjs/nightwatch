const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Uploads file to an element using absolute file Path.
 *
 * <div class="alert alert-warning"><strong>setValue</strong> does not clear the existing value of the element. To do so, use the <strong>clearValue()</strong> command.</div>
 *
 * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
 *
 * @example
 * // send some simple text to an input
 * this.demoTest = function (browser) {
 *   browser.uploadFile('#myFile', '/path/file.pdf');
 * };
 * //
 * // send a file to for upload to a field.
 * this.demoTest = function (browser) {
 *   browser.uploadFile('#myFile', '/path/file.pdf');
 * };
 *
 *
 * @link /session/:sessionId/element/:id/value
 * @method uploadFile
 * @syntax .uploadFile(selector, absoluteFilePath, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string|array} inputValue The file path to upload.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link https://www.selenium.dev/documentation/en/remote_webdriver/remote_webdriver_client/
 * @api protocol.elementinteraction
 */

class UploadFile extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'uploadFile';
  }
}


module.exports = UploadFile;