/**
 * Checks if the given element does not have the specified CSS class.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.cssClassNotPresent('#main', 'container');
 *    };
 * ```
 *
 * @method cssClassNotPresent
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

  console.warn('DEPRECATED: the assertion .cssClassNotPresent() has been deprecated and will be ' +
    'removed from future versions. Use assert.not.cssClassPresent().');

  this.formatMessage = function() {
    let message = msg || 'Testing if element %s doesn\'t have css class %s';

    return {
      message,
      args: [this.elementSelector, `'${className}'`]
    }
  };

  this.expected = function() {
    return `has not ${className}`;
  };

  this.evaluate = function() {
    return !this.classList.includes(className);
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
