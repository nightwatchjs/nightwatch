const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('browser navigation commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testRefresh', function (done) {
    Globals.protocolTest({
      assertion() {
      },
      commandName: 'refresh',
      args: []
    }).then(result => {
      assert.strictEqual(result, null);
      done();
    }).catch(err => done(err));
  });

  it('testBack', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
      },
      commandName: 'back',
      args: []
    }).then(result => {
      assert.strictEqual(result, null);
      done();
    }).catch(err => done(err));
  });

  it('testForward', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
      },
      commandName: 'forward',
      args: []
    }).then(result => {
      assert.strictEqual(result, null);
      done();
    }).catch(err => done(err));
  });

  it('testNavigateTo', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'url');
        assert.strictEqual(opts.url, 'https://test.com');
      },
      commandName: 'url',
      args: ['https://test.com']
    }).then(result => {
      assert.strictEqual(result, null);
      done();
    }).catch(err => done(err));
  });
});
