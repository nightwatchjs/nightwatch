/**
 * Checks if the specified DOM property of a given element has the expected value. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 * If the result value is JSON object or array, a deep equality comparison will be performed.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.domPropertyEquals('#main', 'className', 'visible');
 *
 *   // deep equal will be performed
 *   browser.assert.domPropertyEquals('#main', 'classList', ['class-one', 'class-two']);
 *
 *   // split on ',' and deep equal will be performed
 *   browser.assert.domPropertyEquals('#main', 'classList', 'class-one,class-two']);
 * };
 *
 * @method assert.domPropertyEquals
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} domProperty The DOM property name.
 * @param {string} expected The expected value of the DOM property to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const assert = require('assert');
const Utils = require('../../utils');
const {Logger, setElementSelectorProps} = Utils;

function formatMsg({msg, domProperty, expected, verb = function(negate) {}}) {
  const message = msg || `Testing if dom property %s of element %s ${verb(this.negate)}`;
  let expectedArg = expected;

  if (Utils.isObject(expected)) {
    try {
      expectedArg = JSON.stringify(expected);
    } catch (e) {
      Logger.error(e);
      expectedArg = `[${e.name} ${e.message}]`;
    }
  }

  return {
    message,
    args: [`'${domProperty}'`, this.elementSelector, `'${expectedArg}'`]
  };
}

exports.assertion = function(definition, domProperty, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    return formatMsg.call(this, {msg, domProperty, expected, verb(negate) {
      return negate ? 'doesn\'t equal %s' : 'equals %s';
    }});
  };

  this.expected = function() {
    return this.negate ? `not ${expected}` : expected;
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (value === null) {
      return `Element does not have a '${domProperty}' dom property`;
    }

    return value;
  };

  this.evaluate = function(value) {
    if (Utils.isObject(value)) {
      try {
        if (Array.isArray(value) && Utils.isString(expected)) {
          expected = expected.split(',');
        }

        // deepStrictEqual doesn't seem to catch the JSON stringify errors correctly
        try {
          JSON.stringify(expected);
        } catch (e) {
          return false;
        }

        assert.deepStrictEqual(value, expected);

        return true;
      } catch (err) {
        return false;
      }
    }

    return value === expected;
  };

  this.command = function(callback) {
    this.api.getElementProperty(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), domProperty, callback);
  };
};

exports.formatMessage = formatMsg;
