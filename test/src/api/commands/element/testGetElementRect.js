const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getElementRect', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getElementRect()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/rect',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }
      })
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/size',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: {
          width: 100,
          height: 100
        }
      })
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/location',
      method: 'GET',
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: {
          x: 1,
          y: 1
        }
      }
    });

    this.client.api
      .getElementRect('#weblogin', function callback(result) {
        assert.deepStrictEqual(result.value, {
          x: 1,
          y: 1,
          width: 100,
          height: 100
        });
      })
      .getElementRect('css selector', '#weblogin', function callback(result) {
        assert.deepStrictEqual(result.value, {
          x: 1,
          y: 1,
          width: 100,
          height: 100
        });
      });

    this.client.start(done);
  });
});
