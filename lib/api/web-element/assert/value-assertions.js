const AssertionError = require('assertion-error');

module.exports.create = function createAssertions(scopedValue, {negated, nightwatchInstance}) {

  class ValueAssertions {
    constructor(scopedValue, {negated}) {
      this.negated = negated;
      this.scopedValue = scopedValue;
    }

    async _assert(callback) {
      const assert = nightwatchInstance.api.assert;
      await callback(this.negated ? assert.not : assert, this.scopedValue.value);

      return this.scopedValue;
    }

    get not() {
      return createAssertions(this.scopedValue, {
        negated: true,
        nightwatchInstance
      });
    }

    contains(expected, message) {
      return this._assert((assertApi, value) => {
        return assertApi.promisedValue({
          callback() {
            return value;
          }, verb: 'contains', message, expected, evaluate(value) {
            return value.includes(expected);
          }, timeout: 0
        });
      });
    }

    equals(expected, message) {
      return this._assert((assertApi, value) => {
        return assertApi.promisedValue({
          callback() {
            return value;
          }, verb: 'equals', message, expected, evaluate(value) {
            return value === expected;
          }, timeout: 0
        });
      });
    }

    matches(expected, message) {
      return this._assert((assertApi, value) => {
        return assertApi.promisedValue({
          callback() {
            return value;
          }, verb: 'contains', message, expected, evaluate(value) {
            return expected.test(value);
          }, failure(expected) {
            if (expected instanceof RegExp) {
              return null;
            }

            return new AssertionError(`Expected value must be a regular expression; ${typeof expected} given.`);
          }, timeout: 0
        });
      });
    }
  }

  return new ValueAssertions(scopedValue, {
    negated
  });
};
