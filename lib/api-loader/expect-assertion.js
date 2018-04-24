const chai = require('chai-nightwatch');
const ChaiAssertion = chai.Assertion;
const BaseCommandLoader = require('./_base-loader.js');

const ChaiAssertionType = {
  PROPERTY: 'property',
  METHOD: 'method'
};

class ExpectAssertionLoader extends BaseCommandLoader {

  createAssertion(chaiAssert, args = []) {
    const nightwatchInstance = this.nightwatchInstance;

    class Assertion extends this.module {
      constructor() {
        super();

        this.setAssertion(chaiAssert)
          .setClient(nightwatchInstance)
          .init(...args);
      }
    }

    chaiAssert.assertion = new Assertion();
  }

  loadAssertion() {
    if (!this.commandName) {
      return;
    }

    let assertionType = this.module.assertionType;
    let commandName = this.module.assertionName || this.commandName;
    let method = '';

    switch (assertionType) {
      case ChaiAssertionType.PROPERTY:
        method = 'addProperty';
        break;
      case ChaiAssertionType.METHOD:
        method = 'addMethod';
        break;
    }

    if (!Array.isArray(commandName)) {
      commandName = [commandName];
    }

    const self = this;
    commandName.forEach(command => {
      ChaiAssertion[method](command, function(...args) {
        self.createAssertion(this, args);
      });
    });
  }
}

module.exports = ExpectAssertionLoader;