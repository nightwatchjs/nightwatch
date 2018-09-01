
class Exports {
  constructor(moduleObject, testcase) {
    this.moduleObject = moduleObject;
    this.currentTest = testcase;
  }

  loadTests() {
    return Object.keys(this.moduleObject).filter(key => {
      if (!this.moduleObject[key]) {
        return false;
      }

      return typeof this.moduleObject[key] == 'function';
    });
  }
}

module.exports = Exports;