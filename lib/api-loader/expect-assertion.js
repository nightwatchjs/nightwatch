const events = require('events');
const chai = require('chai-nightwatch');
const ChaiAssertion = chai.Assertion;
const BaseCommandLoader = require('./_base-loader.js');
const Element = require('../page-object/element.js');

class ElementInstance extends events.EventEmitter {
  constructor(selector, using) {
    super();

    this.selector = selector;
    this.using = using;
    this.startTime = null;
    this.emitter = null;
    this.createPromise();
    this.__instance = Element.createFromSelector(selector, using);
  }

  getElementsCommand(callback) {
    this.locator = this.using || client.locateStrategy || 'css selector';
    return Protocol.elements(this.locator, this.selector, callback);
  }

  locate(emitter) {
    if (emitter) {
      this.emitter = emitter;
      this.startTime = new Date().getTime();
    }

    this.getElementsCommand(function(result) {
      if (result.status !== 0 || !result.value || result.value.length === 0) {
        this.deferred.reject(result);
      } else {
        this.deferred.resolve(result.value[0]);
      }
    }.bind(this));
  }
}

const ChaiAssertionType = {
  PROPERTY: 'property',
  METHOD: 'method'
};

class ExpectAssertionLoader extends BaseCommandLoader {

  createAssertion(chaiAssert, args) {
    class ChaiAssertion extends this.module {
      constructor() {
        super(...args);

        this.setAssertion(chaiAssert)
          .setClient(this.nightwatchInstance)
          //.setProtocol()
          .init();
      }
    }

    chaiAssert.assertion = new ChaiAssertion();
  }

  loadAssertion() {
    if (!this.commandName) {
      return;
    }

    let assertionType = this.module.assertionType;

    switch (assertionType) {
      case ChaiAssertionType.PROPERTY:
        ChaiAssertion.addProperty(this.commandName, function() {
          this.createAssertion(this);
        });
        break;
      case ChaiAssertionType.METHOD:
        ChaiAssertion.addMethod(this.commandName, function(...args) {
          this.createAssertion(this, args);
        });
        break;
    }
  }
}

module.exports = ExpectAssertionLoader;