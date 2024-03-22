var assert = require('assert');
exports.assertion = function(testVal, done) {
  this.expected = true;
  this.message = '';

  this.pass = function(value) {
    assert.strictEqual(testVal, value, 'Value passed to the `pass` method is incorrect.');

    return value === this.expected;
  };

  this.value = function(result) {
    assert.deepStrictEqual(result, {
      value: testVal
    }, 'Value passed to the `value` method is incorrect.');

    return result.value;
  };

  this.command = function(callback) {
    assert.strictEqual(callback.length, 1, 'Callback expects 1 single argument.');
    assert.ok(callback.name.indexOf('commandCallback') > -1);
    assert.ok(typeof this.api !== 'undefined');

    callback({
      value: testVal
    });

    done();

    return this;
  };

};