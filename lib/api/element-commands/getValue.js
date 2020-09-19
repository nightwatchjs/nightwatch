const BaseElementCommand = require('./_baseElementCommand.js');
const BrowserName = require('../../utils');

/**
 * Returns a form element current value.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getValue('#login input[type=text]', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getValue('css selector', '#login input[type=text]', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getValue({
 *       selector: '#login input[type=text]',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getValue('#login input[type=text]');
 *     console.log('Value', result);
 *   }
 * }
 *
 * @method getValue
 * @syntax .getValue(selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The element's value.
 * @link /#dfn-get-element-tag-name
 * @api protocol.elementstate
 */
class GetValue extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  protocolAction() {
    if (this.api.capabilities) {
      // FIXME: temporary fix to get safari working
      const {browserName, version} = this.api.capabilities;
      let {browserVersion} = this.api.capabilities;

      if (version) {
        browserVersion = version;
      }
      browserVersion = parseInt(browserVersion, 10);

      // Are we running 12 or newer?
      if (browserName.toLowerCase() === BrowserName.SAFARI && (browserVersion >= 12) && this.settings.webdriver.start_process === true) {
        return this.executeProtocolAction('getElementProperty', ['value']);
      }
    }
    return this.executeProtocolAction('getElementAttribute', ['value']);
  }
}

module.exports = GetValue;
