class ValueAssertions {
  constructor(scopedValue, {negated, nightwatchInstance}) {
    this.negated = negated;
    this.scopedValue = scopedValue;
    this.nightwatchInstance = nightwatchInstance;
  }

  #assert(callback) {
    const assert = this.nightwatchInstance.api.assert;

    callback(this.negated ? assert.not : assert, this.scopedValue.value);

    return this.scopedValue;
  }

  get not() {
    return new ValueAssertions(this.scopedValue, {
      negated: true,
      nightwatchInstance: this.nightwatchInstance
    });
  }

  contains(expected, message) {
    return this.#assert((assertApi, value) =>
      assertApi.contains(value, expected, message)
    );
  }

  equals(expected, message) {
    return this.#assert((assertApi, value) =>
      assertApi.equals(value, expected, message)
    );
  }

  matches(expected, message) {
    return this.#assert((assertApi, value) =>
      assertApi.matches(value, expected, message)
    );
  }
}

module.exports.ScopedValueAssertions = ValueAssertions;
