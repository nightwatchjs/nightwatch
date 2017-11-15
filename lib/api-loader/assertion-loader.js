const Reporter = require('../core/reporter.js');
const NightwatchAssertion = require('./command/assertion.js');
const CommandLoader = require('./command-loader.js');

class AssertionLoader extends CommandLoader {

  validateModuleDefinition() {
    if (!(typeof this.module === 'object' && this.module.assertion)) {
      let error = new Error('The assertion module needs to contain an .assertion() method');
      Reporter.registerTestError(error);
      throw error;
    }
  }

  createAssertionWrapper(abortOnFailure) {
    this.validateModuleDefinition();

    let moduleDefinition = this.module.assertion;
    let assertion = new NightwatchAssertion(this.nightwatchInstance);
    assertion.abortOnFailure = abortOnFailure;

    this.commandFn = function commandFn(...args) {
      assertion.stackTrace = commandFn.stackTrace;
      assertion.createInstance(moduleDefinition, args);

      return assertion.executeCommand();
    };

    return this;
  }
}

module.exports = AssertionLoader;