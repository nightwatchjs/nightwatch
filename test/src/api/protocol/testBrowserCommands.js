const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('browser navigation commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testRefresh', function (done) {
    Globals.protocolTest({
      assertion() {
        done();
      },
      commandName: 'refresh',
      args: []
    });
  });

  it('testBack', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
        done();
      },
      commandName: 'back',
      args: []
    });
  });

  it('testForward', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
        done();
      },
      commandName: 'forward',
      args: []
    });
  });
});
