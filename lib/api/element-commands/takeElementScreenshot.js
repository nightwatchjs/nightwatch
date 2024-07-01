const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Take a screenshot of the visible region encompassed by this element's bounding rectangle.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.takeElementScreenshot('#main', function (imageData, err) {
 *       require('fs').writeFile('out.png', imageData.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *
 *     // with explicit locate strategy
 *     browser.takeElementScreenshot('css selector', '#main', function(imageData, err) {
 *       require('fs').writeFile('out.png', imageData.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.takeElementScreenshot({
 *       selector: '#main ul li a',
 *       index: 1
 *     }, function(imageData, err) {
 *       require('fs').writeFile('out.png', imageData.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const data = await browser.takeElementScreenshot('#main');
 *     require('fs').writeFile('out.png', data, 'base64');
 *   }
 * }
 *
 * @method takeElementScreenshot
 * @syntax .takeElementScreenshot(selector, callback)
 * @syntax .takeElementScreenshot(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} Take a screenshot of the visible region encompassed by this element's bounding rectangle.
 * @link /#dfn-take-element-screenshot
 * @api protocol.screens
 * @since 2.0.0
 */
class TakeElementScreenshot extends BaseElementCommand {
  get elementProtocolAction() {
    return 'takeElementScreenshot';
  }
}

module.exports = TakeElementScreenshot;
