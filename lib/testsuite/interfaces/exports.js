
class Exports {
  constructor(moduleObject, currentTest) {
    this.moduleObject = moduleObject;
    this.currentTest = currentTest;
  }

  loadTests() {
    return Object.keys(this.moduleObject).filter(key => {
      if (!this.moduleObject[key]) {
        return false;
      }

      let isFunction = typeof this.moduleObject[key] == 'function';
      if (this.currentTest) {
        return isFunction && (key === this.currentTest);
      }

      return isFunction;
    });
  }
}

module.exports = Exports;