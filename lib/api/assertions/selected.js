
/**
 * Checks if the given element is selected.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.selected('.should_be_selected');
 *   browser.assert.selected({selector: '.should_be_selected'});
 *   browser.assert.selected({selector: '.should_be_selected', suppressNotFoundErrors: true});
 * };
 *
 * @method assert.selected
 * @param {string|object} definition The selector (CSS / Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/working-with-page-objects/#element-properties).
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    const message = msg || `Testing if element %s ${this.negate ? 'is not selected' : 'is selected'}`;

    return {
      message,
      args: [this.elementSelector]
    };
  };

  this.expected = function() {
    return this.negate ? 'is not selected' : 'is selected';
  };

  this.evaluate = function(value) {
    return value === true;
  };

  this.actual = function(passed) {
    return passed ? 'selected' : 'not selected';
  };

  this.command = function(callback) {
    this.api.isSelected(definition, callback);
  };

};
