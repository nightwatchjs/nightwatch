var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('element actions', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testElement: function (done) {
    var protocol = this.protocol;
    var command = protocol.element('id', '#weblogin', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element');
  },

  testElementIdElement: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdElement('0', 'id', '#weblogin', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/0/element');
  },

  testElementPlural: function (done) {
    var protocol = this.protocol;

    var command = protocol.elements('id', '#weblogin', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/elements');
  },

  testElementIdElementPlural: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdElements('0', 'id', '#weblogin', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/0/elements');
  },

  testElementActive: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementActive(function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/active');
  },

  testElementIdClear: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdClear('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/clear');
  },

  testElementIdSelected: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdSelected('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/selected');
  },

  testElementIdEnabled: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdEnabled('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/enabled');
  },

  testElementIdEquals: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdEquals('ELEMENT1', 'ELEMENT2', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/ELEMENT1/equals/ELEMENT2');
  },

  testElementIdAttribute: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdAttribute('TEST_ELEMENT', 'test_attr', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/test_attr');
  },

  testElementIdClick: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdClick('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/click');
  },

  testElementIdCssProperty: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdCssProperty('TEST_ELEMENT', 'test_property', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/css/test_property');
  },

  testElementIdDisplayed: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdDisplayed('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/displayed');
  },

  testElementIdLocation: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdLocation('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location');
  },

  testElementIdLocationInView: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdLocationInView('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location_in_view');
  },

  testElementIdName: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdName('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/name');
  },

  testElementIdSize: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdSize('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/size');
  },

  testElementIdText: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdText('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/text');
  },

  testElementIdValueGet: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdValue('TEST_ELEMENT', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/value');
  },

  testElementIdValuePost: function (done) {
    var protocol = this.protocol;

    var command = protocol.elementIdValue('TEST_ELEMENT', 'test', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"value":["t","e","s","t"]}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/value');
  }
});
