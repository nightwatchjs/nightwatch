exports.assertion = function(callback, expected, msg) {
  this.options = {
    elementSelector: false
  };

  this.expected = function() {
    return this.negate ? `not equals '${expected}'` : `equals '${expected}'`;
  };

  this.formatMessage = function() {
    const message = `Testing if element ${this.negate ? 'doesn\'t %s' : '%s'}`;

    return {
      message,
      args: [`'${expected}'`]
    };
  };

  this.actual = function(passed) {
    const value = this.getValue();

    return this.getValue();
  };

  this.evaluate = function(value) {
    return value === expected;
  };

  this.command = function(done) {
    callback().then(function(passed) {
      done(passed);
    });
  };
};
