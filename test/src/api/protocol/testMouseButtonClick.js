var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('client.mouseButtonClick', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  'test mouseButtonClick click left': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonClick('left', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"button":0}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/click');
  },

  'test mouseButtonClick click right': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonClick('right', function callback() {
      done();
    });

    assert.equal(command.data, '{"button":2}');
  },

  'test mouseButtonClick click middle': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonClick('middle', function callback() {
      done();
    });

    assert.equal(command.data, '{"button":1}');
  },

  'test mouseButtonClick with callback only': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonClick(function callback() {
      done();
    });

    assert.equal(command.data, '{"button":0}');
  },

  'test mouseButtonClick with no args': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonClick();
    command.on('complete', function () {
      done();
    });

    assert.equal(command.data, '{"button":0}');
  },

  'test mouseButtonDown click left': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonDown('left', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"button":0}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/buttondown');
  },

  'test mouseButtonDown click middle': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonDown('middle', function callback() {
      done();
    });

    assert.equal(command.data, '{"button":1}');
  },

  'test mouseButtonDown with callback only': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonDown(function callback() {
      done();
    });

    assert.equal(command.data, '{"button":0}');
  },

  'test mouseButtonUp click right': function (done) {
    var protocol = this.protocol;

    var command = protocol.mouseButtonUp('right', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"button":2}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/buttonup');
  }
});
