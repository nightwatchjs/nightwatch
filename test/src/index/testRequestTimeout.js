const common = require('../../common.js');
const HttpRequest = common.require('http/request.js');
const MockServer  = require('../../lib/mockserver.js');
const assert = require('assert');

describe('test HttpRequestTimeout', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', function() {
      done();
    });
  });

  afterEach(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('testRequestTimeout', function (done) {
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

  });

  it('testRetryAttempts', function (done) {
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
      host: 'localhost',
      timeout: 50,
      retry_attempts: 1,
      default_path: '/wd/hub',
      port: 10195,
      credentials: {
        username: '',
        key: ''
      }
    };

    var request = new HttpRequest(options);
    assert.equal(request.retryAttempts, 1);
    assert.deepEqual(request.httpOpts, {
      host: 'localhost',
      port: 10195,
      default_path: '/wd/hub',
      credentials: {
        username: '',
        key: ''
      },
      use_ssl: false,
      proxy: null,
      timeout: 50,
      retry_attempts: 1
    });

    request
      .on('error', function(err) {
        assert.equal(request.retryCount, 1);
        assert.ok(err instanceof Error);
        assert.equal(err.code, 'ECONNRESET');
      })
      .on('success', function () {
        assert.strictEqual(request.retryAttempts, 0);
        assert.strictEqual(request.retryCount, 1);
        done();
      })
      .send();
  });
});
