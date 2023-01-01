const chaiNightwatch = require('chai-nightwatch');
const BaseLoader = require('./_base-loader.js');

class ExpectAssertionLoader extends BaseLoader {
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
    aliases = [],
    nightwatchInstance,
    AssertModule,
    expectCommandName
  }) {
    if (!Array.isArray(commandName)) {
      commandName = [commandName];
    }

    const method = ExpectAssertionLoader.getChaiAssertionType(assertionType);

    commandName.forEach(command => {
      const assertFn = function(...args) {
        const assertion = new AssertModule({nightwatchInstance, chaiExpect: this, expectCommandName});

        assertion.init(...args);
        this.assertion = assertion;

        return this;
      };

      if (!Array.isArray(aliases)) {
        throw new Error(`Error while creating expect assertion: .aliases property needs to be an Array; received: ${aliases}`);
      }

      aliases.push(command);
      aliases.forEach(alias => chaiNightwatch.Assertion[method](alias, assertFn));
    });
  }

  loadAssertion(expectCommandName) {
    if (!this.commandName) {
      return;
    }

    const {nightwatchInstance} = this;
    const assertionType = this.module.assertionType;
    const commandName = this.module.assertionName || this.commandName;
    const aliases = this.module.aliases;

    ExpectAssertionLoader.createMatcher({
      nightwatchInstance,
      assertionType,
      commandName,
      expectCommandName,
      aliases,
      AssertModule: this.module
    });
  }
}

module.exports = ExpectAssertionLoader;
