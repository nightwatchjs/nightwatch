var os     = require('os');
var path   = require('path');
var fs     = require('fs');
var mockery = require('mockery');
var Client = require('../../nightwatch.js');

module.exports = {
  setUp: function (callback) {
    this.client = null;
    callback();
  },

  'Test initialization' : function(test) {
    var self = this;
    this.client = Client.init();
    this.client.on('selenium:session_create', function(sessionId) {
      test.equal(self.client.sessionId, 1352110219202, 'Testing if session ID was set correctly');
      test.equal(self.client.api.capabilities.browserName, 'firefox');
      test.done();
    });
  },

  'Test runProtocolCommand without error' : function(test) {
    var client = this.client = Client.init();

    client.on('selenium:session_create', function(sessionId) {
      var request = client.runProtocolAction({
        host : '127.0.0.1',
        path : '/test',
        port : 10195
      });

      test.ok('send' in request);

      request.on('result', function(result, response) {
        test.equal(result.status, 0);
        test.done();
      }).on('complete', function() {
      }).on('error', function() {
      }).send();
    });
  },

  'Test runProtocolAction with error' : function(test) {
    var client = this.client = Client.init();

    client.saveScreenshotToFile = function() {};
    client.options.screenshots.enabled = true;
    client.on('selenium:session_create', function(sessionId) {
      var request = client.runProtocolAction({
        host : '127.0.0.1',
        path : '/test_error',
        port : 10195
      });

      request.on('result', function(result) {
        test.equal(result.status, -1);
        test.equal(result.errorStatus, 7);
        test.equal(result.value.screen, undefined);
        test.equal(result.error, 'An element could not be located on the page using the given search parameters.');
        test.done();
      })
      .send();
    });
  },

  testRunCommand : function(test) {
    var client = this.client = Client.init();

    client.enqueueCommand('url', ['http://localhost'], function() {
      test.ok(true, 'Callback 1 was called');
      test.done();
    });
  },

  testChromeSessionWithRedirectStatus : function(test) {
    var client = this.client = Client.init({
      desiredCapabilities: {
        browserName : 'chrome'
      }
    });
    test.expect(2);
    client.on('selenium:session_create', function(sessionId) {
      test.equal(sessionId, 1352110219202);
      test.equal(client.api.capabilities.browserName, 'chrome');
      test.done();
    });
  },

  'Test saveScreenshotToFile' : function(test) {
    var client = this.client = Client.init();
    var tmp = os.tmpdir();
    var filePath = path.resolve(tmp, 'r3lekb', 'foo.png');
    var data = 'nightwatch';

    client.saveScreenshotToFile(filePath, data, function(err, actualFilePath) {
      test.equal(err, null);
      test.equal(actualFilePath, filePath);

      fs.readFile(actualFilePath, function(err) {
        test.equal(err, null);
        test.done();
      });
    });
  },

  'Test saveScreenshotToFile mkpath failure' : function(test) {
    var client = this.client = Client.init();
    var filePath = '/invalid-path';
    var data = 'nightwatch';

    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mockery.registerMock('mkpath', function(location, callback) {
      callback({code:1});
    });

    client.saveScreenshotToFile(filePath, data, function(err) {
      test.deepEqual(err, {code:1});
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
      test.done();
    });
  },

  'Test saveScreenshotToFile writeFile failure' : function(test) {
    var client = this.client = Client.init();
    var filePath = '/valid-path';
    var data = 'nightwatch';

    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mockery.registerMock('mkpath', function(location, callback) {
      callback(null);
    });

    mockery.registerMock('fs', {
      writeFile : function(fileName, content, encoding, callback) {
        callback({err: 1});
      }
    });

    client.saveScreenshotToFile(filePath, data, function(err) {
      test.deepEqual(err, {err:1});
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
      test.done();
    });
  },

  testSetOptions : function(test) {
    var client = this.client = Client.init({
      use_xpath : true,
      launch_url : '/home'
    });
    var eq = test.equals;

    eq(client.context, null);
    eq(client.errors.length, 0);
    test.deepEqual(client.results, {
      passed:0,
      failed:0,
      errors:0,
      skipped:0,
      tests:[]
    });

    eq(client.locateStrategy, 'xpath');
    eq(client.options.use_xpath, true);
    eq(client.options.skip_testcases_on_fail, true);
    eq(client.api.launchUrl, '/home');
    eq(client.api.launch_url, '/home');

    eq(client.options.screenshots.enabled, false);
    eq(typeof client.options.screenshots.on_error, 'undefined');
    eq(client.api.options.screenshots, false);
    test.done();
  },

  testSetOptionsCredentials : function(test) {
    var client = this.client = Client.init({
      username : 'test-user',
      accesKey : 'test-access-key'
    });
    var eq = test.equals;

    eq(client.api.options.username, 'test-user');
    eq(client.api.options.accessKey, 'test-access-key');

    test.done();
  },

  testSetOptionsScreenshots : function(test) {
    var client = this.client = Client.init({
      screenshots : {
        enabled : true,
        path : ''
      },
      log_screenshot_data : true
    });
    var eq = test.equals;

    eq(client.api.options.log_screenshot_data, true);
    eq(client.options.screenshots.on_error, true);
    eq(client.api.options.screenshotsPath, '');

    test.done();
  },

  testSetOptionsScreenshotsOnError : function(test) {
    var client = this.client = Client.init({
      screenshots : {
        enabled : true,
        on_error : true,
        path : ''
      },
      log_screenshot_data : true
    });
    var eq = test.equals;

    eq(client.options.screenshots.on_error, true);

    test.done();
  },

  testSetOptionsScreenshotsThrows : function(test) {
    test.throws(function() {
      this.client = Client.init({
        screenshots : {
          enabled : true
        }
      });
    }.bind(this));
    test.done();
  },

  testEndSessionOnFail : function(test) {
    this.client = Client.init({
      end_session_on_fail : true
    });
    var eq = test.equals;
    eq(this.client.options.end_session_on_fail, true);
    this.client.endSessionOnFail(false);
    eq(this.client.endSessionOnFail(), false);
    eq(this.client.options.end_session_on_fail, false);
    test.done();
  },

  tearDown : function(callback) {
    if (this.client) {
      this.client.queue.reset();
    }
    this.client = null;
    // clean up
    callback();
  }
};
