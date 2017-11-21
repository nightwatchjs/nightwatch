const common = require('../../../common.js');
const AssertionLoader = common.require('api-loader/assertion.js');

module.exports = function(commandName, assertionModule, assertCallback) {

  class AssertionLoaderMock extends AssertionLoader {
    loadModule(dirpath, filename) {
      this.commandName = commandName;
      this.__module = assertionModule;

      return this;
    }

    runAssertion(passed, value, calleeFn, message) {
      super.runAssertion(passed, value, calleeFn, message);

      assertCallback.call(this, passed, value, calleeFn, message);
    }
  }

  return AssertionLoaderMock;
};