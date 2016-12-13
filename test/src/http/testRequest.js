var common = require('../../common.js');
var HttpRequest = common.require('http/request.js');
var Logger = common.require('util/logger');
var nock = require('nock');
var assert = require('assert');
var mockery = require('mockery');

module.exports = {
  'test HttpRequest' : {
    beforeEach: function (callback) {
      mockery.enable();
      Logger.disable();
      HttpRequest.setSeleniumPort(4444);
      HttpRequest.setCredentials({
        username: null,
        key: null
      });
      nock('http://localhost:4444')
        .post('/wd/hub/session')
        .reply(200, {
          status: 0,
          sessionId: '123456-789',
          value: {
            javascriptEnabled: true,
            browserName: 'firefox'
          },
          state: null
        });

      callback();
    },

    afterEach: function () {
      HttpRequest.setTimeout(60000) // back to default after these tests
      HttpRequest.setRetryAttempts(0);

      mockery.disable();
    },

    testSendPostRequest: function (done) {
      var options = {
        path: '/session',
        data: {
          desiredCapabilities: {
            browserName: 'firefox'
          }
        }
      };

      var request = new HttpRequest(options);
      request.on('success', function () {
        done();
      }).send();

      var data = '{"desiredCapabilities":{"browserName":"firefox"}}';
      assert.equal(request.data, data);
      assert.equal(request.contentLength, data.length);

      var opts = request.reqOptions;
      assert.equal(opts.path, '/wd/hub/session');
      assert.equal(opts.hostname, 'localhost');
      assert.equal(opts.port, 4444);
      assert.equal(opts.method, 'POST');
      assert.deepEqual(opts.headers, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': data.length
      });
    },

    testSendPostRequestWithCredentials: function (done) {
      var options = {
        path: '/session',
        data: {
          desiredCapabilities: {
            browserName: 'firefox'
          }
        }
      };

      HttpRequest.setCredentials({
        username: 'test',
        key: 'test-key'
      });

      var request = new HttpRequest(options);
      request.on('success', function () {
        done();
      }).send();

      var authHeader = new Buffer('test:test-key').toString('base64');
      assert.ok('Authorization' in request.reqOptions.headers);
      assert.equal(request.reqOptions.headers.Authorization, 'Basic ' + authHeader);
    },

    testSendPostRequestWithProxy: function (done) {
      function ProxyAgentMock(uri) {
        this.proxy = uri;
      };

      mockery.registerMock('proxy-agent', ProxyAgentMock);

      var options = {
        path: '/session',
        data: {
          desiredCapabilities: {
            browserName: 'firefox'
          }
        }
      };

      HttpRequest.setProxy('http://localhost:8080');

      var request = new HttpRequest(options);
      request.on('success', function () {
        done();
      }).send();

      var opts = request.reqOptions;
      assert.ok('agent' in opts);
      assert.ok('proxy' in opts.agent);

      HttpRequest.setProxy(null);
    },

    testResponseWithRedirect: function (done) {
      nock('http://localhost:4444')
        .post('/wd/hub/redirect')
        .reply(302, {}, {
          Location: 'http://localhost/wd/hub/session'
        });

      var options = {
        path: '/redirect',
        data: {}
      };
      var request = new HttpRequest(options);
      request.on('success', function (result, response, redirected) {
        assert.ok(redirected);
        done();
      }).send();

    },

    testGetRequest: function (done) {
      nock('http://localhost:4444')
        .get('/wd/hub/123456/element')
        .reply(200, {});

      var options = {
        path: '/:sessionId/element',
        method: 'GET',
        sessionId: '123456'
      };

      var request = new HttpRequest(options);
      assert.equal(request.reqOptions.headers.Accept, 'application/json');
      assert.equal(request.reqOptions.path, '/wd/hub/123456/element');

      request.on('success', function (result) {
        done();
      }).send();
    },

    testErrorResponse: function (done) {
      nock('http://localhost:4444')
        .post('/wd/hub/error')
        .reply(500, {
          status: -1,
          stackTrace: '{}',
          message: 'Unable to locate element'
        });

      var options = {
        path: '/redirect',
        data: {}
      };

      var request = new HttpRequest(options);
      request.on('error', function (result, response, screenshotContent) {
        assert.ok(typeof result.stackTrace == 'undefined');
        assert.ok(typeof result.message == 'undefined');
        done();
      }).send();

    },

    testErrorResponseLocalised: function (done) {
      nock('http://localhost:4444')
        .post('/wd/hub/error')
        .reply(500, {
          status: -1,
          stackTrace: '{}',
          localizedMessage: 'no such element',
          message: 'no such element'
        });

      var options = {
        path: '/redirect',
        data: {}
      };

      var request = new HttpRequest(options);
      request.on('error', function (result, response, screenshotContent) {
        assert.ok(typeof result.stackTrace == 'undefined');
        assert.ok(typeof result.localizedMessage == 'undefined');
        assert.ok(typeof result.message == 'undefined');
        done();
      }).send();

    }
  }

};
