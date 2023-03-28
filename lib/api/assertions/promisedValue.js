exports.assertion = function({callback, evaluate, expected, verb, message, failure = function() {}}) {
  this.options = {
    elementSelector: false
  };

  this.expected = function() {
    return this.negate ? `not ${verb} '${expected}'` : `${verb} '${expected}'`;
  };

  this.formatMessage = function() {
    const msg = message || `Testing if element ${this.negate ? 'doesn\'t %s' : '%s'}`;

    return {
      message: msg,
      args: [`'${expected}'`]
    };
  };

  this.getValue = function() {
    return this.value;
  };

  this.failure = function() {
    const failed = failure(expected);

    if (failed) {
      return failed.message;
    }

    return null;
  };

  this.evaluate = function(value) {
    return evaluate(value);
  };

  this.command = function(done) {
    callback().then((value) => {
      this.value = value;
      done(value);
    }, function(error) {
      done(error);
    });
  };
};
