const common = require('../../../common.js');
const AssertionLoader = common.require('api-loader/assertion.js');
const NightwatchError = common.require('core/assertion.js').AssertionError;

module.exports = function(commandName, assertionModule, assertCallback, done) {

  class AssertionLoaderMock extends AssertionLoader {
    loadModule(dirpath, filename) {
      this.commandName = commandName;
      this.__module = assertionModule;

      return this;
    }

    runAssertion(passed, value, calleeFn, message) {
      super.runAssertion(passed, value, calleeFn, message)
        .then(() => {
          return assertCallback.call(this, passed, value, calleeFn, message);
        })
        .catch(err => {
          if (err instanceof NightwatchError) {
            return assertCallback.call(this, passed, value, calleeFn, message);
          }

          throw err;
        })
        .then(() => done())
        .catch(err => done(err));
    }
  }

  return AssertionLoaderMock;
};