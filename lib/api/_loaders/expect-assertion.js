const chai = require('chai-nightwatch');
const BaseCommandLoader = require('./_base-loader.js');

class ExpectAssertionLoader extends BaseCommandLoader {
  static get ChaiAssertionType() {
    return {
      PROPERTY: 'property',
      METHOD: 'method'
    };
  }

  static getChaiAssertionType(assertionType) {
    const {PROPERTY, METHOD} = ExpectAssertionLoader.ChaiAssertionType;

    switch (assertionType) {
      case PROPERTY:
        return 'addProperty';

      case METHOD:
        return 'addMethod';
    }
  }

  static createMatcher({
    assertionType,
    commandName,
    nightwatchInstance,
    AssertModule,
    expectCommandName
  }) {
    if (!Array.isArray(commandName)) {
      commandName = [commandName];
    }

    const method = ExpectAssertionLoader.getChaiAssertionType(assertionType);

    commandName.forEach(command => {
      chai.Assertion[method](command, function(...args) {
        const assertion = new AssertModule({nightwatchInstance, chaiExpect: this, expectCommandName});

        assertion.init(...args);
        this.assertion = assertion;

        const {commandArgs} = assertion.emitter;
        const element = commandArgs[0];
        const shouldReturnPromise = element && (element.sessionId && element.elementId || element.driver_ && element.id_);

        if (!shouldReturnPromise) {
          return;
        }

        return new Promise((resolve, reject) => {
          assertion.emitter.once('complete', result => {
            resolve(result);
          });

          assertion.emitter.once('error', error => {
            reject(error);
          });
        })
      });
    });
  }

  loadAssertion(expectCommandName) {
    if (!this.commandName) {
      return;
    }

    const {nightwatchInstance} = this;
    const assertionType = this.module.assertionType;
    const commandName = this.module.assertionName || this.commandName;

    ExpectAssertionLoader.createMatcher({
      nightwatchInstance,
      assertionType,
      commandName,
      expectCommandName,
      AssertModule: this.module
    });
  }
}

module.exports = ExpectAssertionLoader;
