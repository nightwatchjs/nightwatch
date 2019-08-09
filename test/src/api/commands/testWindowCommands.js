const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('window', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.closeWindow()', function (done) {
    this.client.api.closeWindow(function(res) {
      assert.strictEqual(res.status, 0);
    });

    this.client.start(done);
  });

  it('client.switchWindow()', function (done) {
    this.client.api.switchWindow('0', function(res) {
      assert.strictEqual(res.status, 0);
    });

    this.client.start(done);
  });

  it('client.switchWindow() - no callback', function (done) {
    this.client.api.switchWindow('0');

    this.client.start(done);
  });

  it('client.resizeWindow()', function (done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/window/current/size',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.resizeWindow(100, 100, function(res) {
      assert.strictEqual(res.status, 0);
    });

    this.client.start(done);
  });

  it('client.setWindowRect()', function (done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/window/rect',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.setWindowRect({width: 100, height: 100}, function(res) {
      assert.strictEqual(res.status, 0);
    });

    this.client.start(done);
  });

  it('client.getWindowRect()', function (done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/window/rect',
      method:'GET',
      response : JSON.stringify({
        value: {
          width: 1000,
          height: 1000,
          x: 100,
          y: 100
        }
      })
    });

    this.client.api.getWindowRect(function(value) {
      assert.deepStrictEqual(value, {width: 1000, height: 1000, x: 100, y: 100});
    });

    this.client.start(done);
  });

  it('client.setWindowSize()', function (done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/window/current/size',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.setWindowSize(100, 100, function(res) {
      assert.strictEqual(res.status, 0);
    });

    this.client.start(done);
  });
});
