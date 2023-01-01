const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Uploads file to an element using absolute file path.
 *
 * @example
 * // send a file to for upload to a field.
 * this.demoTest = function (browser) {
 *   browser.uploadFile('#myFile', '/path/file.pdf');
 * };
 * //
 *
 * @method uploadFile
 * @syntax .uploadFile(selector, absoluteFilePath, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string|array} inputValue The file path to upload.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @moreinfo www.selenium.dev/documentation/en/remote_webdriver/remote_webdriver_client/
 * @api protocol.elementinteraction
 * @since 2.0.0
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