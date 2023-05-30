/**
 * Checks if the given element is visible on the page.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.visible('.should_be_visible');
 *   browser.assert.visible({selector: '.should_be_visible'});
 *   browser.assert.visible({selector: '.should_be_visible', suppressNotFoundErrors: true});
 * };
 *
 * @method assert.visible
 * @param {string|object} definition The selector (CSS / Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/working-with-page-objects/#element-properties).
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const {setElementSelectorProps} = require('../../utils');

exports.assertion = function(definition, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    const message = msg || `Testing if element %s ${this.negate ? 'is not visible' : 'is visible'}`;

    return {
      message,
      args: [this.elementSelector]
    };
  };

  this.expected = function() {
    return this.negate ? 'is not visible' : 'is visible';
  };

  this.evaluate = function(value) {
    return value === true;
  };

  this.actual = function(passed) {
    return passed ? 'visible' : 'not visible';
  };

  this.command = function(callback) {
    this.api.isVisible(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), callback);
  };
};
