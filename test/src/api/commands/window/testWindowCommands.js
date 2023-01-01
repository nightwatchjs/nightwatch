const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const nock = require('nock');

describe('window', function () {
  before(function (done) {
    try {
      nock.activate();
    } catch(e){
      //ignore
    }

    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    nock.cleanAll();
    nock.restore();
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.closeWindow()', function (done) {
    this.client.api.closeWindow(function(res) {
      assert.strictEqual(res.value, null);
    });

    this.client.start(done);
  });

  it('client.switchWindow()', function (done) {
    this.client.api.switchWindow('0', function(res) {
      assert.strictEqual(res.value, null);
    });

    this.client.start(done);
  });

  it('client.switchWindow() - no callback', function (done) {
    this.client.api.switchWindow('0');

    this.client.start(done);
  });

  it('client.getWindowSize()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/window/rect',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: {
          width: 1000,
          height: 1000,
          x: 100,
          y: 100
        }
      })
    });

    this.client.api.getWindowSize(function(res) {
      assert.ok(res instanceof Object);
      assert.deepStrictEqual(res, {
        width: 1000,
        height: 1000,
        x: 100,
        y: 100
      });
    });

    this.client.start(done);
  });

  it('client.resizeWindow()', function (done) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/window/rect')
      .reply(200, function (uri, requestBody) {
      
        assert.deepStrictEqual(requestBody, {
          width: 1000, 
          height: 1000
        });

        return {
          sessionId: '1352110219202',
          status: 0,
          value: {
            width: 1000,
            height: 1000,
            x: 100,
            y: 100
          }
        };
      });

    this.client.api.resizeWindow(1000, 1000, function(res) {
      assert.strictEqual(res.status, 0);
      assert.strictEqual(res.value, null);
    });
  
    this.client.start(done);
  });
  
  it('client.setWindowSize()', function (done) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/window/rect')
      .reply(200, function (uri, requestBody) {
      
        assert.deepStrictEqual(requestBody, {
          width: 1000, 
          height: 1000
        });

        return {
          sessionId: '1352110219202',
          status: 0,
          value: {
            width: 1000,
            height: 1000,
            x: 100,
            y: 100
          }
        };
      });

    this.client.api.setWindowSize(1000, 1000, function(res) {
      assert.strictEqual(res.status, 0);
      assert.strictEqual(res.value, null);
    });

    this.client.start(done);
  });

  it('client.setWindowPosition()', function (done) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/window/rect')
      .reply(200, function (uri, requestBody) {
      
        assert.deepStrictEqual(requestBody, {
          x: 100, 
          y: 100
        });

        return {
          sessionId: '1352110219202',
          status: 0,
          value: {
            width: 1000,
            height: 1000,
            x: 100,
            y: 100
          }
        };
      });

    this.client.api.setWindowPosition(100, 100, function(res) {
      assert.strictEqual(res.status, 0);
      assert.strictEqual(res.value, null);
    });

    this.client.start(done);
  });
});
