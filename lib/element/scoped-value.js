const {
  ScopedValueAssertions
} = require('../assertion/scoped-value-assertions.js');

class ScopedValue {
  constructor(value, nightwatchInstance) {
    this.value = Promise.resolve(value);
    this.nightwatchInstance = nightwatchInstance;
  }

  then(onFulfilled, onRejected) {
    return this.value.then(onFulfilled, onRejected);
  }

  map(callback) {
    return new ScopedValue(this.then(callback), this.nightwatchInstance);
  }

  get assert() {
    return new ScopedValueAssertions(this, {
      negated: false,
      nightwatchInstance: this.nightwatchInstance
    });
  }
}

exports.ScopedValue = ScopedValue;
