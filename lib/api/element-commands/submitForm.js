const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Submits the form containing this element (or this element if it is itself a FORM element). his command is a no-op if the element is not contained in a form.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.submitForm('form.login');
 * };
 *
 *
 * @method submitForm
 * @syntax .submitForm(selector, [callback])
 * @syntax .submitForm(using, selector, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @jsonwire
 * @api protocol.elementinteraction
 */
class SubmitForm extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'elementSubmit';
  }
}

module.exports = SubmitForm;
