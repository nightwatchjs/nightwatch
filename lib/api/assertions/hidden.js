/**
 * Checks if the given element is not visible on the page.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.hidden('.should_not_be_visible');
 *    };
 * ```
 *
 * @method hidden
 * @param {string} definition The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 * @deprecated
 */
const {setElementSelectorProps} = require('../../utils');
const MSG_ELEMENT_NOT_FOUND = 'Testing if element %s is hidden. ' +
  'Element could not be located.';

exports.assertion = function(definition, msg) {
  this.expected = true;
  this.message = msg || 'Testing if element %s is hidden.';

  // eslint-disable-next-line no-console
  console.warn('DEPRECATED: the assertion .hidden() has been deprecated and will be ' +
    'removed from future versions. Use assert.not.visible() instead.');

  this.pass = function(value) {
    return value === this.expected;
  };

  this.failure = function(result) {
    let failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || MSG_ELEMENT_NOT_FOUND;
    }

    return failed;
  };

  this.value = function(result) {
    return !result.value;
  };

  this.command = function(callback) {
    this.api.isVisible(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), callback);
  };

};
