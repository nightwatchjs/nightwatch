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
  }

  return new ScopedValue(value);
};

