/**
 * Uploads file to an element using absolute file path.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#myFile').upload('/path/file.pdf');
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('#myFile').upload('/path/file.pdf');
 *   }
 * }
 *
 * @since 3.0.0
 * @method upload
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).upload(filePath)
 * @param {string} file The file path to upload.
 * @tutorial www.selenium.dev/documentation/en/remote_webdriver/remote_webdriver_client/
 * @returns {ScopedWebElement}
 */
module.exports.command = function(file) {
  return this.runQueuedCommand('uploadFile', {
    args: [file]
  });
};
