var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('browser commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testMoveTo: function (done) {
    var protocol = this.protocol;

    var command = protocol.moveTo('testElement', 0, 1, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"element":"testElement","xoffset":0,"yoffset":1}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/moveto');
  }
});
