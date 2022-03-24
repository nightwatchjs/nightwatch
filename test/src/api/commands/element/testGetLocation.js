const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getLocation', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getLocation()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/rect',
      method: 'GET',
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: {
          width: 10,
          height: 20,
          x: 1,
          y: 0
        }
      }
    });

    this.client.api.getLocation('css selector', '#weblogin', function callback(result) {
      assert.deepStrictEqual(result, {status: 0, value: {x: 1, y: 0, width: 10, height: 20}});
    }).getLocation('#weblogin', function callback(result) {
      assert.deepStrictEqual(result, {status: 0, value: {x: 1, y: 0, width: 10, height: 20}});
    });

    this.client.start(done);
  });

  it('client.getLocation() with webdriver protocol', function (done) {
    Nightwatch.initW3CClient({
    }).then(client => {
      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/rect',
        method: 'GET',
        response: {
          value: {
            x: 341.5,
            y: 340.95001220703125,
            width: 683,
            height: 60
          }
        }
      }, true);

      client.api.getLocation('#webdriver', function (result) {
        assert.deepStrictEqual(result, {
          status: 0,
          value: {
            x: 341.5,
            y: 340.95001220703125,
            width: 683,
            height: 60
          }
        });
      });

      client.start(done);
    });
  });
});
