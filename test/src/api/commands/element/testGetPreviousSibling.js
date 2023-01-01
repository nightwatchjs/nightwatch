const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('browser.getPreviousSibling', function () {

  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });



  it('.getPreviousSibling', function (done) {

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',

      response: {
        value: {
          'ELEMENT': '1'
        }
      }
    }, true);

    this.client.api.getPreviousSibling('#weblogin', function callback(result) {
      assert.ok(result.value);
      assert.strictEqual(result.value.getId(), '1');
    });
    this.client.start(done);
  });


  it('.getPreviousSibling - no such element', function (done) {

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      method: 'POST',
      postdata: {
        using: 'css selector',
        value: '#badDriver'
      },

      response: {
        status: 0,
        sessionId: '1352110219202',
        value: [{
          ELEMENT: '2'
        }]
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: {
        status: 0,
        value: null
      }
    });

    this.client.api.getPreviousSibling('#badDriver', function callback(result) {
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });



  it('.getPreviousSibling - webdriver protcol', function (done) {
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/execute/sync',
        response: {
          value: {
            'element-6066-11e4-a52e-4f735466cecf': 'f54dc0ef-c84f-424a-bad0-16fef6595a70'
          }
        }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/execute/sync',
        response: {
          value: {
            'element-6066-11e4-a52e-4f735466cecf': 'f54dc0ef-c84f-424a-bad0-16fef6595a70'
          }
        }
      }, true);

      client.api.getPreviousSibling('#webdriver', function (result) {
        assert.ok(result.value);
        assert.strictEqual(result.value.getId(), 'f54dc0ef-c84f-424a-bad0-16fef6595a70');
      }).getPreviousSibling('#webdriver', function callback(result) {
        assert.ok(result.value);
        assert.strictEqual(result.value.getId(), 'f54dc0ef-c84f-424a-bad0-16fef6595a70');
      });

      client.start(done);
    });
  });

  it('.getPreviousSibling - webdriver protcol no such element', function (done) {
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/execute/sync',
        response: {
          value: null
        }
      });

      client.api.getPreviousSibling('#webdriver', function (result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });

});
