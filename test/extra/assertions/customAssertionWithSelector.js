/**
 * @param {object} element
 * @param variable
 * @params {function} [done]
 */
exports.assertion = function(element, variable, done) {
  this.expected = true;
  this.selector = element.selector;
  this.element = element;
  this.variable = variable;
  this.message = '';
  this.rescheduleInterval = 50;
  this.retryAssertionTimeout = 100;

  this.pass = function(value) {
    return value === this.variable;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    callback({
      value: 0
    });
  };

};
