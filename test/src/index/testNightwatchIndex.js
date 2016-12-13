var os     = require('os');
var path   = require('path');
var fs     = require('fs');
var mockery = require('mockery');
var assert = require('assert');

var MockServer  = require('../../lib/mockserver.js');
var Nightwatch = require('../../lib/nightwatch.js');

module.exports = {
  'test NightwatchIndex' : {
    before : function(done) {
      this.server = MockServer.init();
      this.server.on('listening', function() {
        done();
      });
    },
    after : function(done) {
      this.server.close(function() {
        done();
      });
    },

    'Test initialization': function (done) {
      var client = Nightwatch.createClient({});

      client.once('selenium:session_create', function (sessionId) {
        assert.equal(client.sessionId, 1352110219202, 'Testing if session ID was set correctly');
        assert.equal(client.api.capabilities.browserName, 'firefox');
        done();
      });

      client.startSession();
    },

    'Test runProtocolCommand without error': function (done) {
      var client = Nightwatch.createClient({});
      client.on('selenium:session_create', function (sessionId) {
        var request = client.runProtocolAction({
          host: '127.0.0.1',
          path: '/test',
          port: 10195
        });

        assert.ok('send' in request);

        request.on('result', function (result, response) {
          assert.equal(result.status, 0);
          done();
        }).send();
      });

      client.startSession();
    },

    'Test runProtocolAction with error': function (done) {
      var client = Nightwatch.createClient({});

      client.saveScreenshotToFile = function () {};
      client.options.screenshots.enabled = true;
      client.on('selenium:session_create', function (sessionId) {
        var request = client.runProtocolAction({
          host: '127.0.0.1',
          path: '/test_error',
          port: 10195
        });

        request.on('result', function (result) {
          assert.equal(result.status, -1);
          assert.equal(result.errorStatus, 7);
          assert.equal(result.value.screen, undefined);
          assert.equal(result.error, 'An element could not be located on the page using the given search parameters.');
          done();
        })
        .send();
      });

      client.startSession();
    },

    testRunCommand: function (done) {
      var client = Nightwatch.createClient({});

      client.api.url('http://localhost', function () {
        assert.ok(true, 'Callback 1 was called');
        done();
      });

      client.queue.run();
    },

    testChromeSessionWithRedirectStatus: function (done) {
      MockServer.addMock({
        url : '/wd/hub/session',

        postdata : JSON.stringify({
          desiredCapabilities: {
            browserName : 'chrome',
            javascriptEnabled: true,
            acceptSslCerts:true,
            platform:'ANY'
          }
        }),

        responseHeaders : {
          location : 'http://localhost:10195/wd/hub/session/1352110219202'
        },
        statusCode : 302,
        method: 'POST'
      }, true);

      MockServer.addMock({
        url : '/wd/hub/session/1352110219202',
        response : JSON.stringify({
          status: 0,
          sessionId: '1352110219202',
          value: { javascriptEnabled: true, browserName: 'chrome'},
          state: null
        }),
        responseHeaders : {
          statusCode : 201
        },
        method: 'GET'
      }, true);

      var client = Nightwatch.createClient({
        desiredCapabilities: {
          browserName: 'chrome'
        }
      });

      client.on('selenium:session_create', function (sessionId) {
        assert.equal(sessionId, 1352110219202);
        assert.equal(client.api.capabilities.browserName, 'chrome');
        done();
      });

      client.startSession();
    },

    'Test saveScreenshotToFile': function (done) {
      var client = Nightwatch.createClient({});
      var tmp = os.tmpdir();
      var filePath = path.resolve(tmp, 'r3lekb', 'foo.png');
      var data = 'nightwatch';

      client.saveScreenshotToFile(filePath, data, function (err, actualFilePath) {
        assert.equal(err, null);
        assert.equal(actualFilePath, filePath);

        fs.readFile(actualFilePath, function (err) {
          assert.equal(err, null);
          done();
        });
      });

      client.startSession();
    },

    'Test saveScreenshotToFile mkpath failure': function (done) {
      var client = Nightwatch.createClient({});
      var filePath = '/invalid-path';
      var data = 'nightwatch';

      mockery.enable({useCleanCache: true, warnOnUnregistered: false});
      mockery.registerMock('mkpath', function (location, callback) {
        callback({code: 1});
      });

      client.saveScreenshotToFile(filePath, data, function (err) {
        assert.deepEqual(err, {code: 1});
        mockery.deregisterAll();
        mockery.resetCache();
        mockery.disable();
        done();
      });
    },

    'Test saveScreenshotToFile writeFile failure': function (done) {
      var client = Nightwatch.createClient({});
      var filePath = '/valid-path';
      var data = 'nightwatch';

      mockery.enable({useCleanCache: true, warnOnUnregistered: false});
      mockery.registerMock('mkpath', function (location, callback) {
        callback(null);
      });

      mockery.registerMock('fs', {
        writeFile: function (fileName, content, encoding, callback) {
          callback({err: 1});
        }
      });

      client.saveScreenshotToFile(filePath, data, function (err) {
        assert.deepEqual(err, {err: 1});
        mockery.deregisterAll();
        mockery.resetCache();
        mockery.disable();
        done();
      });
    },

    testSetOptions: function () {
      var client = Nightwatch.createClient({
        use_xpath: true,
        launch_url: '/home'
      });
      var eq = assert.equal;

      eq(client.context, null);
      eq(client.errors.length, 0);
      assert.deepEqual(client.results, {
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        tests: []
      });

      eq(client.locateStrategy, 'xpath');
      eq(client.options.use_xpath, true);
      eq(client.api.options.skip_testcases_on_fail, true);
      eq(client.api.launchUrl, '/home');
      eq(client.api.launch_url, '/home');

      eq(client.options.screenshots.enabled, false);
      eq(typeof client.options.screenshots.on_error, 'undefined');
      eq(client.api.options.screenshots, false);
    },

    testSetOptionsCredentials: function () {
      var client = Nightwatch.createClient({
        username: 'test-user',
        accesKey: 'test-access-key'
      });
      var eq = assert.equal;

      eq(client.api.options.username, 'test-user');
      eq(client.api.options.accessKey, 'test-access-key');
    },

    testSetOptionsScreenshots: function () {
      var client = Nightwatch.createClient({
        screenshots: {
          enabled: true,
          path: ''
        },
        log_screenshot_data: true
      });
      var eq = assert.equal;

      eq(client.api.options.log_screenshot_data, true);
      eq(client.options.screenshots.on_error, true);
      eq(client.api.options.screenshotsPath, '');
    },

    testSetOptionsScreenshotsOnError: function () {
      var client = Nightwatch.createClient({
        screenshots: {
          enabled: true,
          on_error: true,
          path: ''
        },
        log_screenshot_data: true
      });
      var eq = assert.equal;

      eq(client.options.screenshots.on_error, true);
    },

    testSetOptionsScreenshotsThrows: function () {
      assert.throws(function () {
        Nightwatch.createClient({
          screenshots: {
            enabled: true
          }
        });
      });
    },

    testEndSessionOnFail: function () {
      var client = Nightwatch.createClient({
        end_session_on_fail: true
      });

      var eq = assert.equal;
      eq(client.options.end_session_on_fail, true);
      client.endSessionOnFail(false);
      eq(client.endSessionOnFail(), false);
      eq(client.options.end_session_on_fail, false);
    },

    testSetRequestTimeoutOptions: function () {
      var client = Nightwatch.createClient({
        request_timeout_options: {
          timeout : 10000,
          retry_attempts : 3
        }
      });

      assert.deepEqual(client.options.request_timeout_options, {
        timeout : 10000,
        retry_attempts : 3
      });

      var common = require('../../common.js');
      var HttpRequest = common.require('http/request.js');
      var request = new HttpRequest({});
      assert.equal(request.timeout, 10000);
      assert.equal(request.retryAttempts, 3);
    },

    'test session response with status success and no sessionId': function (done) {
      MockServer.addMock({
        url : '/wd/hub/session',
        postdata : JSON.stringify({
          desiredCapabilities: {
            browserName : 'safari',
            javascriptEnabled: true,
            acceptSslCerts:true,
            platform:'ANY'
          }
        }),
        response : '{"value":{"message":"Could not find device : iPhone 6"}}',
        statusCode : 200,
        method: 'POST'
      }, true);

      var client = Nightwatch.createClient({
        desiredCapabilities: {
          browserName: 'safari'
        }
      });

      client.on('error', function (data) {
        assert.equal(typeof data, 'object');
        assert.ok('value' in data);
        assert.ok('message' in data.value);
        assert.equal(data.value.message, 'Could not find device : iPhone 6');
        done();
      });

      client.startSession();
    }
  }
};
