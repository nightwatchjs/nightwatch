const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the computed WAI-ARIA label of an element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.takeElementScreenshot('*[name="search"]', true, function (image, err) {
 *       require('fs').writeFile('out.png', image.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *
 *     // with explicit locate strategy
 *     browser.takeElementScreenshot('css selector', '*[name="search"]', true, function(image, err) {
 *       require('fs').writeFile('out.png', image.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.takeElementScreenshot({
 *       selector: '#main ul li a',
 *       true,
 *       index: 1
 *     }, function(image, err) {
 *       require('fs').writeFile('out.png', image.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *
 *     browser.takeElementScreenshot({
 *       selector: '*[name="search"]',
 *       true,
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     }, function(image, err) {
 *       require('fs').writeFile('out.png', image.value, 'base64', function (err) {
 *         console.log(err);
 *       });
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.takeElementScreenshot('*[name="search"]', true);
 *     require('fs').writeFile('out.png', result.value, 'base64');
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
 */
class TakeElementScreenshot extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'takeElementScreenshot';
  }
}

module.exports = TakeElementScreenshot;
