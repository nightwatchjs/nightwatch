const chai = require('chai-nightwatch');
const ChaiAssertion = chai.Assertion;
const BaseCommandLoader = require('./_base-loader.js');

const ChaiAssertionType = {
  PROPERTY: 'property',
  METHOD: 'method'
};

class ExpectAssertionLoader extends BaseCommandLoader {

  createAssertion(chaiAssert, args) {
    class Assertion extends this.module {
      constructor() {
        super(...args);

        this.setAssertion(chaiAssert)
          .setClient(this.nightwatchInstance)
          .init();
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

    commandName.forEach(command => {
      ChaiAssertion[method](command, function(...args) {
        this.createAssertion.apply(this, args);
      }.bind(this));
    });
  }
}

module.exports = ExpectAssertionLoader;