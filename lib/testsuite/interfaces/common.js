const TestHooks = require('../hooks.js');

module.exports = class CommonInterface {
  static get TestHooks() {
    return Object.keys(TestHooks.TEST_HOOKS);
  }

  static get DEFAULT_ATTRIBUTES() {
    return {
      '@unitTest': false,
      '@name': undefined,
      '@endSessionOnFail': undefined,
      '@skipTestcasesOnFail': undefined,
      '@disabled': false,
      '@desiredCapabilities': null,
      '@tags': null
    };
  }

  constructor(instance) {
    this.instance = instance;
    this.modulePath = instance.modulePath;
    this.currentTest = instance.currentTest;
  }

  createInterface() {}
};
