const AssertionError = require('assertion-error');

module.exports.create = function createAssertions(scopedValue, {negated, nightwatchInstance}) {

  class ValueAssertions {
    constructor(scopedValue, {negated}) {
      this.negated = negated;
      this.scopedValue = scopedValue;
    }

    _assert(callback) {
      // The below promise is returned to the test case by the assertion, so
      // it should fail in case the actual assertion (callback) fails. In case
      // of a sync test, the actual assertion would never fail, so we always
      // resolve the promise.
      const assertPromise = new Promise((resolve, reject) => {
        const assert = nightwatchInstance.api.assert;
        const callbackResult = callback(this.negated ? assert.not : assert, this.scopedValue.value);
        if (callbackResult instanceof Promise) {
          callbackResult
            .then(() => {
              resolve(this.scopedValue);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve(this.scopedValue);
        }
      });

      // prevent unhandledRejection errors, while also making sure
      // that the exception/failure passes to the actual test case.
      assertPromise.catch((err) => {});

      return assertPromise;
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
