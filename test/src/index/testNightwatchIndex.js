var os     = require('os');
var path   = require('path');
var fs     = require('fs');
var mockery = require('mockery');
const assert = require('assert');
const common = require('../../common.js');

const MockServer = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');
const Transport = common.require('protocol/selenium.js');

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
      let  client = Nightwatch.createClient({
        silent: false,
        output: false
      });

      client.on('nightwatch:session.create', function (data) {
        assert.equal(client.api.sessionId, 1352110219202, 'Testing if session ID was set correctly');
        assert.equal(client.api.capabilities.browserName, 'firefox');
        done();
      });
      client.startSession();
    },

    'Test runProtocolCommand without error': function (done) {
      let  client = Nightwatch.createClient({});
      client.on('nightwatch:session.create', function (sessionId) {
        let request = Transport.runProtocolAction({
          host: '127.0.0.1',
          path: '/test',
          method: 'POST',
          port: 10195
        });

        //assert.ok('send' in request);

        request.then(result => {
          assert.equal(result.status, 0);
          done();
        });
      });

      client.startSession();
    },

    'Test runProtocolAction with error': function (done) {
      let client = Nightwatch.createClient({
        screenshots: {
          enabled: true,
          path: './'
        },
        output: false,
        silent: false
      });

      let Reporter = common.require('core/reporter.js');
      let originalFn = Reporter.saveErrorScreenshot;
      Reporter.saveErrorScreenshot = function (content) {
        Reporter.saveErrorScreenshot = originalFn;
      };

      client.on('nightwatch:session.create', function () {
        let request = Transport.runProtocolAction({
          host: '127.0.0.1',
          path: '/test_error',
          method: 'POST',
          port: 10195
        });

        request.then(result => {
          assert.equal(result.status, -1);
          assert.equal(result.errorStatus, 7);
          assert.strictEqual(result.value.screen, undefined);
          assert.equal(result.error, 'An element could not be located on the page using the given search parameters.');
          done();
        });
      });

      client.startSession();
    },
    /*
                testRunCommand: function (done) {
                  let client = Nightwatch.createClient({});

                  client.api.url('http://localhost', function () {
                    assert.ok(true, 'Callback 1 was called');
                    done();
                  });

                  client.queue.run();
                },
                */

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

        let client = Nightwatch.createClient({
          desiredCapabilities: {
            browserName: 'chrome'
          },
          silent: false,
          output: false
        });

        client.on('nightwatch:session.create', function (data) {
          assert.equal(data.sessionId, 1352110219202);
          assert.equal(client.api.capabilities.browserName, 'chrome');
          done();
        });

        client.startSession();
      },
    /*
          'Test saveScreenshotToFile': function (done) {
            let client = Nightwatch.createClient({});
            let tmp = os.tmpdir();
            let filePath = path.resolve(tmp, 'r3lekb', 'foo.png');
            let data = 'nightwatch';

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
             let client = Nightwatch.createClient({});
             let filePath = '/invalid-path';
             let data = 'nightwatch';

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
             let client = Nightwatch.createClient({});
             let filePath = '/valid-path';
             let data = 'nightwatch';

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
     */
    testSetOptions: function () {
      let client = Nightwatch.createClient({
        use_xpath: true,
        launch_url: '/home'
      });
      let eq = assert.equal;

      /*
      eq(client.errors.length, 0);
      assert.deepEqual(client.results, {
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        tests: []
      });
      */
      eq(client.locateStrategy, 'xpath');
      eq(client.options.use_xpath, true);
      eq(client.api.options.skip_testcases_on_fail, true);
      eq(client.api.launchUrl, '/home');
      eq(client.api.launch_url, '/home');
    },

    testSetWebdriverOptionsDefaults: function () {
      let client = Nightwatch.createClientDefaults();
      let eq = assert.equal;

      eq(client.options.webdriver.host, 'localhost');
      eq(client.options.webdriver.port, 4444);
      eq(client.options.webdriver.ssl, false);
      eq(client.options.screenshots.enabled, false);
      eq(typeof client.options.screenshots.on_error, 'undefined');
      eq(client.api.options.screenshots, false);
      eq(client.options.start_session, true);
      eq(client.options.end_session_on_fail, true);
    },

    testSetWebdriverOptions: function () {
      let client = Nightwatch.createClient({
        webdriver: {
          host: '127.0.0.1',
          port: 4445,
          ssl: false,
          timeout_options: {
            timeout: 10000,
            retry_attempts: 3
          },
          default_path_prefix: '',
          username: 'test-user',
          access_key: 'test-key'
        }
      });

      let eq = assert.equal;
      let HttpRequest = common.require('http/request.js');
      let request = new HttpRequest({});

      eq(request.reqOptions.host, '127.0.0.1');
      eq(request.reqOptions.port, 4445);
      eq(request.hostname, '');
      eq(request.defaultPathPrefix, '');
    },

    testSetOptionsCredentials: function () {
      let client = Nightwatch.createClient({
        username: 'test-user',
        accessKey: 'test-access-key'
      });

      let eq = assert.equal;

      eq(client.options.username, 'test-user');
      eq(client.api.options.username, 'test-user');
      eq(client.api.options.accessKey, 'test-access-key');
      eq(client.options.accessKey, 'test-access-key');
    },

    testSetOptionsScreenshots: function () {
      let client = Nightwatch.createClient({
        screenshots: {
          enabled: true,
          path: ''
        },
        log_screenshot_data: true
      });
      let eq = assert.equal;

      eq(client.api.options.log_screenshot_data, true);
      eq(client.options.screenshots.on_error, true);
      eq(client.api.options.screenshotsPath, '');
    },

    testSetOptionsScreenshotsOnError: function () {
      let client = Nightwatch.createClient({
        screenshots: {
          enabled: true,
          on_error: true,
          path: ''
        },
        log_screenshot_data: true
      });
      let eq = assert.equal;

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
      let client = Nightwatch.createClient({
        end_session_on_fail: true
      });

      let eq = assert.equal;
      eq(client.options.end_session_on_fail, true);
      eq(client.session.endSessionOnFail, true);

      client.endSessionOnFail(false);
      eq(client.endSessionOnFail(), false);
      eq(client.options.end_session_on_fail, false);
      eq(client.session.endSessionOnFail, false);
    },

    testSetRequestTimeoutOptions: function () {
      let client = Nightwatch.createClient({
        request_timeout_options: {
          timeout : 10000,
          retry_attempts : 3
        }
      });

      assert.deepEqual(client.options.request_timeout_options, {
        timeout : 10000,
        retry_attempts : 3
      });

      assert.deepEqual(client.options.webdriver.timeout_options, {
        timeout : 10000,
        retry_attempts : 3
      });


      let HttpRequest = common.require('http/request.js');
      let request = new HttpRequest({});

      assert.equal(request.httpOpts.timeout, 10000);
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

      let client = Nightwatch.createClient({
        desiredCapabilities: {
          browserName: 'safari'
        },
        silent: true,
        output: false
      });

      client.session.on('session:error', function (message, data) {
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
