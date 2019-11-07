/**
 * Checks if the specified css property of a given element has the expected value. In case the resulting property is an array,
 * several elements could be specified (either as an array or command-separated list). Nightwatch will check each one for presence.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.domPropertyContains('#main', 'classList', 'visible');
 *
 *      // in case the resulting property is an array, several elements could be specified
 *      browser.assert.domPropertyEquals('#main', 'classList', ['class-one', 'class-two']);
 *      browser.assert.domPropertyEquals('#main', 'classList', 'class-one,class-two');
 *    };
 * ```
 *
 * @method domProperty
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} domProperty The DOM property name.
 * @param {string} expected The expected value of the DOM property to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const {formatMessage} = require('./domPropertyEquals.js');
const {containsMultiple} = require('../../utils');

exports.assertion = function(selector, domProperty, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    return formatMessage.call(this, {msg, expected, domProperty, verb(negate) {
      return negate ? 'doesn\'t contain %s' : 'contains %s';
    }});
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (value === null) {
      return `Element does not have a '${domProperty}' dom property`;
    }

    return value;
  };

  this.expected = function() {
    return this.negate ? `not contains '${expected}'` : `contains '${expected}'`;
  };

  this.evaluate = function(value) {
    if (Array.isArray(value) && expected) {
      if (Array.isArray(value) && expected) {
        return containsMultiple(value, expected);
      }
    }

    value = value || '';

    return value.includes(expected);
  };

  this.command = function(callback) {
    this.api.getElementProperty(selector, domProperty, callback);
  };
};

