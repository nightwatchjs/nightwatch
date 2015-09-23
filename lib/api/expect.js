var util = require('util');
var events = require('events');
var chai = require('chai-nightwatch');
var expect = chai.expect;
var ChaiAssertion = chai.Assertion;
var Q = require('q');
var flag = chai.flag;

module.exports = function(client) {
  var Protocol = require('./protocol.js')(client);
  var PresentAssertion = require('./expect/present.js');
  var AttributeAssertion = require('./expect/attribute.js');
  var CssAssertion = require('./expect/css.js');
  var TextAssertion = require('./expect/text.js');
  var EnabledAssertion = require('./expect/enabled.js');
  var VisibleAssertion = require('./expect/visible.js');
  var SelectedAssertion = require('./expect/selected.js');
  var TypeAssertion = require('./expect/type.js');
  var ValueAssertion = require('./expect/value.js');
  var Expect = {};

  ChaiAssertion.addMethod('before', function(ms) {
    flag(this, 'waitFor', ms);
    flag(this, 'before', true);
  });

  ChaiAssertion.addMethod('after', function(ms) {
    flag(this, 'after', true);
    flag(this, 'waitFor', ms);
  });

  ChaiAssertion.addProperty('present', function() {
    createAssertion(PresentAssertion, this);
  });

  ChaiAssertion.addProperty('enabled', function() {
    createAssertion(EnabledAssertion, this);
  });

  ChaiAssertion.addProperty('text', function() {
    createAssertion(TextAssertion, this);
  });

  ChaiAssertion.addProperty('value', function() {
    createAssertion(ValueAssertion, this);
  });

  ChaiAssertion.addProperty('visible', function() {
    createAssertion(VisibleAssertion, this);
  });

  ChaiAssertion.addProperty('selected', function() {
    createAssertion(SelectedAssertion, this);
  });

  ChaiAssertion.addMethod('attribute', function(attribute, msg) {
    createAssertion(AttributeAssertion, this, [attribute, msg]);
  });

  ChaiAssertion.addMethod('css', function(property, msg) {
    createAssertion(CssAssertion, this, [property, msg]);
  });

  function typeAssertion(type, msg) {
    createAssertion(TypeAssertion, this, [type, msg]);
  }

  ChaiAssertion.addMethod('a', typeAssertion);
  ChaiAssertion.addMethod('an', typeAssertion);

  function createAssertion(AssertionClass, chaiAssert, args) {
    function F() {
      this.setAssertion(chaiAssert)
        .setClient(client)
        .setProtocol(Protocol)
        .init();

      return AssertionClass.apply(this, args);
    }
    F.prototype = AssertionClass.prototype;
    chaiAssert.assertion = new F();
  }

  function Element(selector, using) {
    this.selector = selector;
    this.using = using;
    this.startTime = null;
    this.emitter = null;
    this.createPromise();
  }
  util.inherits(Element, events.EventEmitter);

  Element.prototype.getElementsCommand = function(callback) {
    this.locator = this.using || client.locateStrategy || 'css selector';
    return Protocol.elements(this.locator, this.selector, callback);
  };

  Element.prototype.promise = function() {
    return this.deferred.promise;
  };

  Element.prototype.createPromise = function() {
    this.deferred = Q.defer();
    return this.deferred.promise;
  };

  Element.prototype.locate = function(emitter) {
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
  };

  Expect.element = function(selector, using) {
    var element = new Element(selector, using);
    var promise = element.promise();
    var expect  = chai.expect(promise);

    flag(expect, 'selector', selector);
    flag(expect, 'promise', promise);
    flag(expect, 'element', element);

    return {
      element : element,
      expect : expect
    };
  };

  return Expect;
};
