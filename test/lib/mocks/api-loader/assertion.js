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

    runAssertion() {
      return super.runAssertion()
        .then(() => {
          return assertCallback.call(this, this.assertion.passed, this.assertion.actual, this.assertion.calleeFn, this.assertion.message);
        })
        .catch(err => {
          if (err instanceof NightwatchError) {
            return assertCallback.call(this, this.assertion.passed, this.assertion.actual, this.assertion.calleeFn, this.assertion.message);
          }

          throw err;
        })
        .then(() => done())
        .catch(err => done(err));
    }
  }

  return AssertionLoaderMock;
};