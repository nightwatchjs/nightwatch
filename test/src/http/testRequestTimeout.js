var common = require('../../common.js');
var HttpRequest = common.require('http/request.js');
var MockServer  = require('../../lib/mockserver.js');
var Logger = common.require('util/logger');
var assert = require('assert');

module.exports = {
  'test HttpRequestTimeout' : {
    beforeEach : function(done) {
      this.server = MockServer.init();
      Logger.setOutputEnabled(false);

      this.server.on('listening', function() {
        done();
      });
    },

    afterEach : function(done) {
      this.server.close(function() {
        done();
      });
    },

    testRequestTimeout: function (done) {
      MockServer.addMock({
        url : '/wd/hub/123456/element',
        response : '',
        method: 'GET',
        socketDelay : 400
      }, true);

      var options = {
        path: '/:sessionId/element',
        method: 'GET',
        sessionId: '123456'
      };

      HttpRequest.globalSettings = {
        timeout: 50,
        default_path: '/wd/hub',
        port: 10195
      };

      var request = new HttpRequest(options);

      request.on('error', function (err) {
        assert.equal(err.code, 'ECONNRESET');
        assert.ok(err instanceof Error);
        done();
      }).on('success', function(result, response) {
        done(new Error('Request should have timed out.'));
      }).send();

    },

    testRetryAttempts: function (done) {
      MockServer.addMock({
        url : '/wd/hub/10000000/element',
        response : '',
        method: 'GET',
        socketDelay : 200
      }, true).addMock({
        url : '/wd/hub/10000000/element',
        response : '',
        method: 'GET'
      }, true);

      var options = {
        path: '/:sessionId/element',
        selenium_port: 10195,
        method: 'GET',
        sessionId: '10000000'
      };

      HttpRequest.globalSettings = {
        timeout: 50,
        retry_attempts: 1,
        default_path: '/wd/hub',
        port: 10195
      };


      var request = new HttpRequest(options);
      assert.equal(request.retryAttempts, 1);

      request
        .on('error', function(res, err) {
          done(err);
        })
        .on('success', function () {
          assert.strictEqual(request.retryAttempts, 0);
          assert.strictEqual(request.retryCount, 1);
          done();
        })
        .send();
    }
  }
};
