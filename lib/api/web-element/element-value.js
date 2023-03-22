const ScopedValueAssertions = require('./assert/value-assertions.js');

module.exports.create = function createScopedValue(value, nightwatchInstance) {

  class ScopedValue {
    constructor(value) {
      this.value = Promise.resolve(value);
    }

    then(onFulfilled, onRejected) {
      return this.value.then(onFulfilled, onRejected);
    }

    map(callback) {
      return createScopedValue(this.then(callback), nightwatchInstance);
    }

    get assert() {
      return ScopedValueAssertions.create(this, {
        negated: false,
        nightwatchInstance
      });
    }
  }

  return new ScopedValue(value);
};

