const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('getElementSize', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getElementSize()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/size',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 100
      })
    });

    this.client.api.getElementSize('#weblogin', function callback(result) {
      assert.strictEqual(result.value, 100);
    }).getElementSize('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, 100);
    });

    this.client.start(done);
  });

  it('client.getElementSize() with webdriver protocol', function(done) {
    Nightwatch.initClient({
      selenium : {
        version2: false,
        start_process: false
      },
      webdriver:{
        start_process: true
      },
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

      client.api.getElementSize('#webdriver', function(result) {
        assert.deepStrictEqual(result.value, {
          x: 341.5,
          y: 340.95001220703125,
          width: 683,
          height: 60
        });
      });

      client.start(done);
    });
  });

});
