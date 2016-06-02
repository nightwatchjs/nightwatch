var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('client.keys()', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testKeys: function (done) {
    var protocol = this.protocol;

    var command = protocol.keys(['A', 'B'], function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"value":["A","B"]}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/keys');
  },

  testKeysSingle: function (done) {
    var protocol = this.protocol;

    var command = protocol.keys('A', function callback() {
      done();
    });

    assert.equal(command.data, '{"value":["A"]}');
  },

  testKeysUnicode: function (done) {
    var protocol = this.protocol;

    var command = protocol.keys('\uE007', function callback() {
      done();
    });

    assert.equal(command.data, '{"value":["\\ue007"]}');
  }

});
