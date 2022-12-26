const assert = require('assert');
const Nightwatch = require('../../../../lib/nightwatch.js');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.click()', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.click()', function(done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/click',
      'response': {
        sessionId: '1352110219202',
        status: 0
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
      'url': '/wd/hub/session/1352110219202/element/0/click',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
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
    Nightwatch.initW3CClient({
      silent: false,
      output: false
    }).then(client => {
      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: {value: null}
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: {value: null}
      }, true);

      client.api.click('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      }).click('css selector', '#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });

  it('client.click() - element not interactable error - failed', function(done) {
    Nightwatch.initW3CClient({
      output: false,
      silent: false
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
      }, null, true);

      let response;
      client.api.click({
        retryInterval: 50,
        timeout: 100,
        selector: '#webdriver'
      }, function(result) {
        response = result;
      });

      client.start(function() {
        try {
          assert.strictEqual(response.status, -1);
          assert.strictEqual(response.value.error, 'An error occurred while running .click() command on <#webdriver>: Element <h1> could not be scrolled into view');

          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  it('client.click() - element not interactable error - success', function(done) {
    Nightwatch.initW3CClient({
      output: false,
      silent: false
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

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: {value: null}
      }, true);

      let response;
      client.api.click({
        retryInterval: 50,
        selector: '#webdriver'
      }, function(result) {
        response = result;
      });

      client.start(function() {
        try {
          assert.strictEqual(response.value, null);

          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  it('client.click() - stale element reference error', function(done) {
    Nightwatch.initW3CClient({
      output: false,
      silent: false
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

  it('client.click() - for native app', function(done) {
    Nightwatch.initW3CClient({
      output: false,
      silent: false,
      selenium: {
        start_process: false,
        use_appium: true,
        port: 10195,
        host: 'localhost'
      },
      desiredCapabilities: {
        'appium:automationName': 'XCUITest',
        browserName: null,
        'appium:appPackage': 'org.wikimedia.wikipedia',
        platformName: 'iOS',
        'appium:deviceName': 'iPhone 13',
        'appium:platformVersion': '15.5'
      }
    }).then(client => {
      MockServer.addMock({
        'url': '/wd/hub/session/13521-10219-202/elements',
        'postdata': {'using':'css selector','value':'#webdriver'},
        'response': {
          value: [{
            'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
          }],
          status: 0
        }
      });

      MockServer.addMock({
        url: '/wd/hub/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        response: {value: null}
      }, true);

      assert.strictEqual(client.api.browserName, null);
      assert.strictEqual(client.api.platformName, 'iOS');

      client.api.click('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });
});
