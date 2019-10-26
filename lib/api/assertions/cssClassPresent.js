/**
 * Checks if the given element has the specified CSS class.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.cssClassPresent('#main', 'container');
 *    };
 * ```
 *
 * @method cssClassPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} className The CSS class to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const classListRegexp = /\s/;
const classNameRegexp = /\w/;

exports.assertion = function(selector, className, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    let message = msg || `Testing if element %s ${this.negate ? 'doesn\'t have css class %s' : 'has css class %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${className}'`]
    }
  };

  this.expected = function() {
    return this.negate ? `has not ${className}` : `has ${className}`;
  };

  this.evaluate = function() {
    return this.classList.includes(className);
  };

  this.value = function(result) {
    this.classList = result.value
      .split(classListRegexp)
      .filter(item => classNameRegexp.test(item));

    return result.value;
  };

  this.command = function(callback) {
    this.api.getAttribute(selector, 'class', callback);
  };
};
