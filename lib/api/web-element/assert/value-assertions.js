module.exports.create = function createAssertions(scopedValue, {negated, nightwatchInstance}) {
  class ValueAssertions {
    constructor(scopedValue, {negated}) {
      this.negated = negated;
      this.scopedValue = scopedValue;
    }

    #assert(callback) {
      const assert = nightwatchInstance.api.assert;

      callback(this.negated ? assert.not : assert, this.scopedValue.value);

      return this.scopedValue;
    }

    get not() {
      return createAssertions(this.scopedValue, {
        negated: true,
        nightwatchInstance: nightwatchInstance
      });
    }

    contains(expected, message) {
      return this.#assert((assertApi, value) => {
        return assertApi.promisedValue(async function() {
          const result = await value;

          return result.includes(expected);
        }, `contains "${expected}"`, message)
      });
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

  return new ValueAssertions(scopedValue, {
    negated
  });
};
