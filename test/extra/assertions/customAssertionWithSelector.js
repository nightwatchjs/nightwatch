/**
 * @param {object} element
 * @param variable
 * @param cb
 */
exports.assertion = function(element, variable, cb) {
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

  this.callback = function(result) {
    cb(result, this);
  };

  this.command = function(callback) {
    callback({
      value : 0
    });

    return this;
  };

};