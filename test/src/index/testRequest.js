const nock = require('nock');
const assert = require('assert');
const mockery = require('mockery');

const common = require('../../common.js');
const HttpRequest = common.require('http/request.js');

describe('test HttpRequest', function() {

  beforeEach(function (callback) {
    try {
      nock.activate();
    } catch (err) {}

    mockery.enable();

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444
    };

    nock('http://localhost:4444')
      .post('/wd/hub/session')
      .reply(200, {
        status: 0,
        sessionId: '123456-789',
        value: {
          browserName: 'firefox'
        },
        state: null
      });

    callback();
  });

  afterEach(function () {
    mockery.disable();
  });

  after(function() {
    nock.restore();
  });

  it('testSendPostRequest', function(done) {
    var options = {
      path: '/session',
      method: 'POST',
      port: 4444,
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
    assert.strictEqual(request.data, data);
    assert.strictEqual(request.contentLength, data.length);

    var opts = request.reqOptions;
    assert.strictEqual(opts.path, '/wd/hub/session');
    assert.strictEqual(opts.hostname, 'localhost');
    assert.strictEqual(opts.port, 4444);
    assert.strictEqual(opts.method, 'POST');
    assert.strictEqual(opts.headers['content-type'], 'application/json; charset=utf-8');
    assert.strictEqual(opts.headers['content-length'], data.length);
    assert.ok(opts.headers['User-Agent'].startsWith('nightwatch.js/'));
  });

  it('testSendPostRequestWithCredentials', function (done) {
    var options = {
      path: '/session',
      method: 'POST',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444,
      credentials: {
        username: 'test',
        key: 'test-key'
      }
    };

    var request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).on('error', function(err) {
      console.error(err);
      done(new Error('Request Failed!'));
    }).send();

    try {
      var authHeader = Buffer.from('test:test-key').toString('base64');
      assert.strictEqual(request.httpRequest.getHeader('Authorization'), 'Basic ' + authHeader);
    } catch (err) {
      done(err);
    }

  });

  it('testSendPostRequestWithProxy', function (done) {
    function ProxyAgentMock(uri) {
      this.proxy = uri;
    }

    mockery.registerMock('proxy-agent', ProxyAgentMock);

    var options = {
      path: '/session',
      method: 'POST',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444,
      proxy: 'http://localhost:8080'
    };

    var request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    var opts = request.reqOptions;
    assert.ok('agent' in opts);
    assert.ok('proxy' in opts.agent);
  });

  it('testResponseWithRedirect', function (done) {
    nock('http://localhost:4444')
      .post('/wd/hub/redirect')
      .reply(302, {}, {
        Location: 'http://localhost/wd/hub/session'
      });

    var options = {
      path: '/redirect',
      method: 'POST',
      port: 4444,
      data: {}
    };
    var request = new HttpRequest(options);
    request.on('success', function (result, response, redirected) {
      assert.strictEqual(redirected, true);
      done();
    }).send();

  });

  it('testGetRequest', function (done) {
    nock('http://localhost:4444')
      .get('/wd/hub/123456/element')
      .reply(200, {});

    var options = {
      path: '/:sessionId/element',
      method: 'GET',
      port: 4444,
      sessionId: '123456'
    };

    var request = new HttpRequest(options);
    request.on('success', function (result) {
      done();
    }).send();

    assert.strictEqual(request.httpRequest.getHeader('Accept'), 'application/json');
    assert.strictEqual(request.reqOptions.path, '/wd/hub/123456/element');
  });

  it('testErrorResponse', function (done) {
    nock('http://localhost:4444')
      .post('/wd/hub/error')
      .reply(500, {
        value: {
          status: -1,
          stackTrace: '{}',
          message: 'Unable to locate element'
        }
      });

    var options = {
      path: '/wd/hub/error',
      method: 'POST',
      data: {}
    };

    var request = new HttpRequest(options);
    request.on('error', function (result, response, screenshotContent) {
      assert.strictEqual(typeof result.stackTrace, 'undefined');
      assert.strictEqual(typeof result.message, 'undefined');
      done();
    }).send();

  });

  it('testErrorResponseLocalised', function (done) {
    nock('http://localhost:4444')
      .post('/wd/hub/error')
      .reply(500, {
        value: {
          status: -1,
          stackTrace: '{}',
          localizedMessage: 'no such element',
          message: 'no such element'
        }
      });

    var options = {
      path: '/wd/hub/error',
      method: 'POST',
      port: 4444,
      data: {}
    };

    var request = new HttpRequest(options);
    request.on('error', function (result, response, screenshotContent) {
      assert.ok(typeof result.stackTrace == 'undefined');
      assert.ok(typeof result.localizedMessage == 'undefined');
      assert.ok(typeof result.message == 'undefined');
      done();
    }).send();
  });

  it('test send post request with keep alive', function (done) {
    const options = {
      path: '/session',
      method: 'POST',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444,
      keep_alive: true
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    const opts = request.reqOptions;
    const http = require('http');
    assert.ok(opts.agent instanceof http.Agent);
    assert.ok('agent' in opts);
  });

  it('test send post request with keep alive extended', function (done) {
    const options = {
      path: '/session',
      method: 'POST',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444,
      keep_alive: {
        keepAliveMsecs: 1000,
        enabled: true
      }
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    const opts = request.reqOptions;
    const http = require('http');
    assert.ok(opts.agent instanceof http.Agent);
    assert.strictEqual(opts.agent.keepAliveMsecs, 1000);
    assert.ok('agent' in opts);
  });

  it('test send post request with keep alive extended - disabled', function (done) {
    const options = {
      path: '/session',
      method: 'POST',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444,
      keep_alive: {
        keepAliveMsecs: 1000,
        enabled: false
      }
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    const opts = request.reqOptions;
    assert.equal(typeof opts.agent, 'undefined');
  });
});
