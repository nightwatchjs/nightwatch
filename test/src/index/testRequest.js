const nock = require('nock');
const assert = require('assert');
const mockery = require('mockery');
const fs = require('fs');
const path = require('path');

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
    nock('http://localhost:4444')
      .delete('/wd/hub/session')
      .reply(200, {
        status: 0,
        sessionId: '123456-789'
      });

    nock('http://localhost:4444')
      .get('/wd/hub/session')
      .reply(200, {
        status: 0,
        sessionId: '123456-789'
      });

    nock('http://localhost:4444')
      .put('/wd/hub/session')
      .reply(200, {
        status: 0,
        sessionId: '123456-789'
      });

    nock('https://api-cloud.browserstack.com')
      .post('/app-automate/upload')
      .reply(200, {
        app_url: 'bs://878bdf21505f0004ce',
        custom_id: 'some_app'
      });

    callback();
  });

  afterEach(function () {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  after(function() {
    nock.restore();
  });

  it('testSendPostRequest', function(done) {
    const options = {
      path: '/session',
      method: 'POST',
      host: 'localhost',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    const data = '{"desiredCapabilities":{"browserName":"firefox"}}';
    assert.strictEqual(request.data, data);
    assert.strictEqual(request.contentLength, data.length);

    const opts = request.reqOptions;
    assert.strictEqual(opts.path, '/wd/hub/session');
    assert.strictEqual(opts.host, 'localhost');
    assert.strictEqual(opts.port, 4444);
    assert.strictEqual(opts.method, 'POST');
    assert.strictEqual(opts.headers['content-type'], 'application/json; charset=utf-8');
    assert.strictEqual(opts.headers['content-length'], data.length);
    assert.ok(opts.headers['User-Agent'].startsWith('nightwatch.js/'));
  });

  it('testSendPostRequestWithCredentials', function (done) {
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
      credentials: {
        username: 'test',
        key: 'test-key'
      }
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).on('error', function(err) {
      console.error(err);
      done(new Error('Request Failed!'));
    }).send();

    try {
      const authHeader = Buffer.from('test:test-key').toString('base64');
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
      proxy: 'http://localhost:8080'
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    const opts = request.reqOptions;
    assert.ok('agent' in opts);
    assert.ok('proxy' in opts.agent);
  });

  it('testGetRequest', function (done) {
    nock('http://localhost:4444')
      .get('/wd/hub/123456/element')
      .reply(200, {});

    const options = {
      path: '/:sessionId/element',
      method: 'GET',
      port: 4444,
      sessionId: '123456'
    };

    const request = new HttpRequest(options);
    assert.strictEqual(request.data, '');
    request.on('success', function (result) {
      done();
    }).send();

    assert.strictEqual(request.httpRequest.getHeader('Accept'), 'application/json');
    assert.strictEqual(request.reqOptions.path, '/wd/hub/123456/element');
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

    const options = {
      host: 'localhost',
      path: '/wd/hub/error',
      method: 'POST',
      port: 4444,
      data: {}
    };

    const request = new HttpRequest(options);
    request.on('complete', function (result, response) {
      assert.strictEqual(result.value.status, -1);
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
    assert.strictEqual(typeof opts.agent, 'undefined');
  });

  it('send POST request with empty data object', function(done){
    const options = {
      path: '/session',
      method: 'POST',
      port: 4444,
      data: {}
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    assert.strictEqual(request.data, '{}');
    assert.deepStrictEqual(request.params, {});
  });

  it('send DELETE request with data', function(done){
    const options = {
      path: '/session',
      method: 'DELETE',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    assert.strictEqual(request.data, '');
    assert.strictEqual(request.params, '');
    
  });


  it('send GET request with data', function(done){
    const options = {
      path: '/session',
      method: 'GET',
      port: 4444,
      data: {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444
    };
    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    assert.strictEqual(request.data, '');
    assert.strictEqual(request.params, '');
    
  });


  it('send PUT request with data', function(done){
    const options = {
      path: '/session',
      method: 'PUT',
      port: 4444,
      data: {}
    };

    HttpRequest.globalSettings = {
      default_path: '/wd/hub',
      port: 4444
    };
    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    assert.strictEqual(request.data, '{}');
    assert.deepStrictEqual(request.params, {});
    
  });

  it('send POST request with multi-part form data', function(done) {
    mockery.registerMock('fs', {
      readFileSync() {
        return Buffer.from('app-data');
      }
    });

    const options = {
      method: 'POST',
      url: 'https://api-cloud.browserstack.com/app-automate/upload',
      use_ssl: true,
      port: 443,
      multiPartFormData: {
        file: {
          filePath: 'some/path/app.apk'
        },
        custom_id: {
          data: 'some_app'
        }
      }
    };

    const request = new HttpRequest(options);
    request.on('success', function () {
      done();
    }).send();

    const boundary = request.formBoundary;
    const data = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="app.apk"\r\n\r\napp-data` +
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="custom_id"\r\n\r\nsome_app` +
      `\r\n--${boundary}--`;
    const bufferData = Buffer.from(data);

    assert.deepStrictEqual(request.data, bufferData);
    assert.strictEqual(request.contentLength, bufferData.length);
    assert.strictEqual(request.use_ssl, true);

    const opts = request.reqOptions;
    assert.strictEqual(opts.path, '/app-automate/upload');
    assert.strictEqual(opts.host, 'api-cloud.browserstack.com');
    assert.strictEqual(opts.port, 443);
    assert.strictEqual(opts.method, 'POST');
    assert.strictEqual(opts.headers['content-type'], `multipart/form-data; boundary=${boundary}`);
    assert.strictEqual(opts.headers['content-length'], bufferData.length);
    assert.ok(opts.headers['User-Agent'].startsWith('nightwatch.js/'));
  });
});
