const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('browser.hasDescendants', function () {


  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('.hasDescendants', function (done) {

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: {
        value: 1
      }
    }, true);

    this.client.api.hasDescendants('#weblogin', function callback(result) {
      assert.ok(result.value);
      assert.strictEqual(result.value, true);
    });
    this.client.start(done);
  });


  it('.hasDescendants - no child element', function (done) {

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
        value: 0
      }
    });

    this.client.api.hasDescendants('#badDriver', function callback(result) {
      assert.strictEqual(result.value, false);
    });

    this.client.start(done);
  });



  it('.hasDescendants - webdriver protcol', function (done) {
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/execute/sync',
        response: {
          value: 4
        }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/execute/sync',
        response: {
          value: 2
        }
      }, true);

      client.api.hasDescendants('#webdriver', function (result) {
        assert.strictEqual(result.value, true);
      }).hasDescendants('#webdriver', function callback(result) {
        assert.strictEqual(result.value, true);
      });

      client.start(done);
    });
  });

  it('.hasDescendants - webdriver protcol no such element', function (done) {
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/execute/sync',
        response: {
          value: 0
        }
      });

      client.api.hasDescendants('#webdriver', function (result) {
        assert.strictEqual(result.value, false);
      });

      client.start(done);
    });
  });

});
