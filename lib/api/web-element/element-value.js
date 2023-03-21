const {
  ScopedValueAssertions
} = require('./assert/value-assertions.js');

class ElementValue {
  constructor(value, nightwatchInstance) {
    this.value = Promise.resolve(value);
    this.nightwatchInstance = nightwatchInstance;
  }

  then(onFulfilled, onRejected) {
    return this.value.then(onFulfilled, onRejected);
  }

  map(callback) {
    return new ElementValue(this.then(callback), this.nightwatchInstance);
  }

  get assert() {
    return new ScopedValueAssertions(this, {
      negated: false,
      nightwatchInstance: this.nightwatchInstance
    });
  }
}

exports.ScopedValue = ElementValue;
