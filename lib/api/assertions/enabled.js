
/**
 * Checks if the given element is enabled (as indicated by the 'disabled' attribute).
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.enabled('.should_be_enabled');
 *   browser.assert.enabled({selector: '.should_be_enabled'});
 *   browser.assert.enabled({selector: '.should_be_enabled', suppressNotFoundErrors: true});
 * };
 *
 * @method assert.enabled
 * @param {string|object} definition The selector (CSS / Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/working-with-page-objects/#element-properties).
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    const message = msg || `Testing if element %s ${this.negate ? 'is not enabled' : 'is enabled'}`;

    return {
      message,
      args: [this.elementSelector]
    };
  };

  this.expected = function() {
    return this.negate ? 'is not enabled' : 'is enabled';
  };

  this.evaluate = function(value) {
    return value === true;
  };

  this.actual = function(passed) {
    return passed ? 'enabled' : 'not enabled';
  };

  this.command = function(callback) {
    this.api.isEnabled(definition, callback);
  };

};
