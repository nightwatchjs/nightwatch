const Common = require('./common.js');
const Utils = require('../../utils');

class Exports extends Common {
  get module() {
    return this.instance.module;
  }

  constructor(instance) {
    super(instance);

    this.moduleKeys = null;
    this.tests = null;
    this.hooks = null;

    this.instance.on('post-require', () => this.createInterface());
  }

  includeTestcase(item) {
    return !Exports.TestHooks.includes(item) && (!this.currentTest || item === this.currentTest);
  }

  reduceKeys(testFn) {
    return this.moduleKeys
      .reduce((accumulator, item) => {
        if (testFn(item)) {
          accumulator.push(item);
        }

        return accumulator;
      }, []);
  }

  addTestCase(testName) {
    const testFn = this.module[testName];
    this.instance.addTestCase({testName, testFn});
  }

  addTestHook(key) {
    this.instance.addTestHook(key, this.module[key]);
  }

  loadHooks() {
    this.hooks = this.reduceKeys(item => Exports.TestHooks.includes(item))
      .map(key => this.addTestHook(key));
  }

  loadTests() {
    this.tests = this.reduceKeys(item => this.includeTestcase(item))
      .map(key => this.addTestCase(key));
  }

  createInterface() {
    this.moduleKeys = Object.keys(this.module).filter(key => {
      if (!this.module[key]) {
        return false;
      }

      return Utils.isFunction(this.module[key]);
    });

    this.loadHooks();
    this.loadTests();
    this.readAttributes();
  }

  getAttribute(attrName) {
    let value = this.module[attrName];
    if (Utils.isUndefined(value)) {
      value = this.module[attrName.substring(1)];

      if (Utils.isUndefined(value)) {
        value = this.instance.getAttribute(attrName);
      }
    }

    return value;
  }

  readAttributes() {
    const attributes = Object.keys(Common.DEFAULT_ATTRIBUTES).reduce((prev, key) => {
      const value = this.getAttribute(key);
      prev[key] = value !== undefined ? value : Common.DEFAULT_ATTRIBUTES[key];

      return prev;
    }, {});

    this.instance.addAttributes(attributes);
  }
}

module.exports = Exports;
