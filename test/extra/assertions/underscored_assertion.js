exports.assertion = function(test, testVal) {
  this.expected = true;
  this.message = '';

  this.pass = function(value) {
    test.equals(testVal, value, 'Value passed to the `pass` method is incorrect.');
    return value === this.expected;
  };

  this.value = function(result) {
    test.deepEqual(result, {
      value : testVal
    }, 'Value passed to the `value` method is incorrect.');
    return result.value;
  };

  this.command = function(callback) {
    callback({
      value : testVal
    });

    return this;
  };

};