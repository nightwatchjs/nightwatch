var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var HttpRequest = require('../../../' + BASE_PATH + '/http/request.js');
var Logger = require('../../../' + BASE_PATH + '/util/logger');
var nock = require('nock');

module.exports = {
  setUp: function (callback) {
    Logger.disable();
    HttpRequest.setSeleniumPort(4444);
    HttpRequest.setCredentials({
      username : null,
      key : null
    });
    nock('http://localhost:4444')
      .post('/wd/hub/session')
      .reply(200, {
        status: 0,
        sessionId : '123456-789',
        value : {
          javascriptEnabled: true,
          browserName: 'firefox'
        },
        state : null
      });

    callback();
  },

  testSendPostRequest : function(test) {
    var options = {
      path : '/session',
      data : {
        desiredCapabilities : {
          browserName : 'firefox'
        }
      }
    };

    var request = new HttpRequest(options);
    request.on('success', function() {
      test.done();
    }).send();

    var data = '{"desiredCapabilities":{"browserName":"firefox"}}';
    test.equal(request.data, data);
    test.equal(request.contentLength, data.length);

    var opts = request.reqOptions;
    test.equal(opts.path, '/wd/hub/session');
    test.equal(opts.hostname, 'localhost');
    test.equal(opts.port, 4444);
    test.equal(opts.method, 'POST');
    test.deepEqual(opts.headers, {
      'Content-Type' : 'application/json; charset=utf-8',
      'Content-Length' : data.length
    });
  },

  testSendPostRequestWithCredentials : function(test) {
    var options = {
      path : '/session',
      data : {
        desiredCapabilities : {
          browserName : 'firefox'
        }
      }
    };

    HttpRequest.setCredentials({
      username : 'test',
      key : 'test-key'
    });

    var request = new HttpRequest(options);
    request.on('success', function() {
      test.done();
    }).send();

    var authHeader = new Buffer('test:test-key').toString('base64');
    test.ok('Authorization' in request.reqOptions.headers);
    test.equal(request.reqOptions.headers.Authorization, 'Basic ' +authHeader);
  },

  testResponseWithRedirect : function(test) {
    nock('http://localhost:4444')
      .post('/wd/hub/redirect')
      .reply(302, {}, {
        Location : 'http://localhost/wd/hub/session'
      });

    var options = {
      path : '/redirect',
      data : {}
    };
    var request = new HttpRequest(options);
    request.on('success', function(result, response, redirected) {
      test.ok(redirected);
      test.done();
    }).send();

  },

  testScreenshotDataInLog : function(test) {
    nock('http://localhost:4444')
      .post('/wd/hub/123456/screenshot')
      .reply(200, {
        status: 0,
        state: 'success',
        value: 'base64-data'
      });

    var options = {
      path : '/:sessionId/screenshot',
      method : 'POST',
      sessionId : '123456'
    };

    var oldLoggerInfo = Logger.info;
    var loggerInfoCalls = [];
    Logger.info = function() {
      loggerInfoCalls.push(arguments);
    };

    Logger.settings.screenshot_data = true;

    var request = new HttpRequest(options);
    request.on('success', function(result) {
      var lastCall = loggerInfoCalls[loggerInfoCalls.length - 1];

      test.ok(lastCall[1].value);
      test.equal(lastCall[1].value, 'base64-data');
      test.ok(result.value);
      test.equal(result.value, 'base64-data');

      Logger.info = oldLoggerInfo;
      test.done();
    }).send();
  },

  testScreenshotDataNotInLog : function(test) {
    nock('http://localhost:4444')
      .post('/wd/hub/123456/screenshot')
      .reply(200, {
        status: 0,
        state: 'success',
        value: 'base64-data'
      });

    var options = {
      path : '/:sessionId/screenshot',
      method : 'POST',
      sessionId : '123456'
    };

    var oldLoggerInfo = Logger.info;
    var loggerInfoCalls = [];
    Logger.info = function() {
      loggerInfoCalls.push(arguments);
    };

    Logger.settings.screenshot_data = false;

    var request = new HttpRequest(options);
    request.on('success', function(result) {
      var lastCall = loggerInfoCalls[loggerInfoCalls.length - 1];

      test.ok(lastCall[1].value);
      test.equal(lastCall[1].value, '[removed by nightwatch due to settings]');
      test.ok(result.value);
      test.equal(result.value, 'base64-data');

      Logger.info = oldLoggerInfo;
      test.done();
    }).send();
  },

  testGetRequest : function(test) {
    nock('http://localhost:4444')
      .get('/wd/hub/123456/element')
      .reply(200, {});

    var options = {
      path : '/:sessionId/element',
      method : 'GET',
      sessionId : '123456'
    };

    var request = new HttpRequest(options);
    test.equal(request.reqOptions.headers.Accept, 'application/json');
    test.equal(request.reqOptions.path, '/wd/hub/123456/element');

    request.on('success', function(result) {
      test.done();
    }).send();
  },

  testErrorResponse : function(test) {
    nock('http://localhost:4444')
      .post('/wd/hub/error')
      .reply(500, {
        status : -1,
        stackTrace : '{}',
        message : 'Unable to locate element'
      });

    var options = {
      path : '/redirect',
      data : {}
    };

    var request = new HttpRequest(options);
    request.on('error', function(result, response, screenshotContent) {
      test.ok(typeof result.stackTrace == 'undefined');
      test.ok(typeof result.message == 'undefined');
      test.done();
    }).send();

  },

  testErrorResponseLocalised : function(test) {
    nock('http://localhost:4444')
      .post('/wd/hub/error')
      .reply(500, {
        status : -1,
        stackTrace : '{}',
        localizedMessage : 'no such element',
        message : 'no such element'
      });

    var options = {
      path : '/redirect',
      data : {}
    };

    var request = new HttpRequest(options);
    request.on('error', function(result, response, screenshotContent) {
      test.ok(typeof result.stackTrace == 'undefined');
      test.ok(typeof result.localizedMessage == 'undefined');
      test.ok(typeof result.message == 'undefined');
      test.done();
    }).send();

  }
};
