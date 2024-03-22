const common = require('../../../common.js');
const AssertionLoader = common.require('api-loader/assertion-loader.js');
const AssertionRunner = common.require('api-loader/assertion-runner.js');
const NightwatchError = common.require('core/assertion.js').AssertionError;

module.exports = function(commandName, assertionModule, assertCallback, done) {
  const originalRun = AssertionLoader.runAssertion;

  AssertionLoader.runAssertion = function(instance, opts) {
    const assertionRun = new AssertionRunnerMock(instance, opts);

    assertionRun.executeCommand();

    assertionRun.deferred.promise
      .then(() => done())
      .catch(err => done(err))
      .then(_ => {
        AssertionLoader.runAssertion = originalRun;
      });
  };

  class AssertionRunnerMock extends AssertionRunner {
    assert() {
      return super.assert()
        .then(() => {
          return assertCallback.call(this, this.assertion.passed, this.assertion.actual, this.assertion.calleeFn, this.assertion.message);
        })
        .catch(err => {
          if (err instanceof NightwatchError) {
            return assertCallback.call(this, this.assertion.passed, this.assertion.actual, this.assertion.calleeFn, this.assertion.message);
          }

          this.deferred.reject(err);
        });
    }
  }

  class AssertionLoaderMock extends AssertionLoader {
    loadModule(dirpath, filename) {
      this.commandName = commandName;
      this.__module = assertionModule;

      return this;
    }

    updateElementSelector(args) {
      return Promise.resolve();
    }
  }

  return AssertionLoaderMock;
};