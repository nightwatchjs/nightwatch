const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element. Uses `submit` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.submitForm('form.login');
 * };
 *
 *
 * @method submitForm
 * @syntax .submitForm(selector, [callback])
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see submit
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
