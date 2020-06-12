const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('click', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.click()', function(done) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : {
        sessionId: '1352110219202',
        status:0
      }
    });
    const api = this.client.api;
    this.client.api.click('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(this, api);
    }).click('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.click() with xpath', function(done) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.useXpath()
      .click('//weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .click('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });

  it('client.click() with webdriver protocol', function(done) {
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
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: { value: null }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: { value: null }
      }, true);

      client.api.click('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      }).click('css selector', '#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });

  it('client.click() - element not interactable error', function(done) {
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
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        statusCode: 400,
        response: {
          value: {
            error: 'element not interactable',
            message: 'Element <h1> could not be scrolled into view',
            stacktrace: ''
          }
        }
      }, true);

      let response;
      client.api.click({
        selector: '#webdriver',
      }, function(result) {
        response = result;
      });

      client.start(function() {
        try {
          assert.strictEqual(response.status, -1);
          assert.strictEqual(response.value.error, 'An error occurred while running .click() command on <#webdriver>: element not interactable; Element <h1> could not be scrolled into view')

          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  it('client.click() - stale element reference error', function(done) {
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
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        statusCode: 404,
        response: {
          value: {
            error: 'stale element reference',
            message: 'stale element reference',
            stacktrace: ''
          }
        }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: {
          value: null
        }
      }, true);

      client.api.click('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });
});
