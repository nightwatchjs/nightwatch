const assert = require('assert');
const MockServer = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');
const common = require('../../common.js');
const HttpRequest = common.require('http/request.js');

describe('test defaultPathPrefix', function () {
  before(function (done) {
    this.server = MockServer.init();
    this.server.on('listening', function () {
      done();
    });
  });

  after(function (done) {
    Nightwatch.createClient({
      default_path_prefix: '/wd/hub'
    });
    HttpRequest.globalSettings = {};

    this.server.close(function () {
      done();
    });
  });

  it('testDefaultPathPrefix', function () {
    Nightwatch.createClient({
      selenium: {
        start_process: true
      }
    });

    var request = new HttpRequest({
      host: '127.0.0.1',
      path: '/test'
    });

    assert.strictEqual(request.defaultPathPrefix, '/wd/hub');
  });

  it('testSetDefaultPathPrefixOption', function () {
    Nightwatch.createClient({
      webdriver: {
        default_path_prefix: '/test'
      }
    });

    let request = new HttpRequest({
      host: '127.0.0.1',
      path: '/test',
      port: 10195
    });

    assert.strictEqual(request.defaultPathPrefix, '');
  });

  it('test set defaultPathPrefix option when already set', function () {
    HttpRequest.globalSettings = {
      default_path: '/wd/hub'
    };

    Nightwatch.createClient({
      default_path_prefix: '/test'
    });

    let request = new HttpRequest({
      host: '127.0.0.1',
      path: '/test',
      port: 10195
    });

    assert.strictEqual(request.defaultPathPrefix, '');
  });

  it('testSetDefaultPathPrefixInvalidOption', function () {
    HttpRequest.globalSettings = {
      default_path: ''
    };

    Nightwatch.createClient({
      webdriver: {
        default_path_prefix: '/wd/hub'
      }
    });

    let eq = assert.strictEqual;
    let request = new HttpRequest({
      host: '127.0.0.1',
      path: '/session',
      port: 10195
    });

    eq(request.defaultPathPrefix, '/wd/hub');
  });

  it('testSetDefaultPathPrefixEmptyOption', function () {
    HttpRequest.globalSettings = {
      default_path: ''
    };

    var request = new HttpRequest({
      host: '127.0.0.1',
      path: '/test',
      port: 10195
    });
    assert.strictEqual(request.defaultPathPrefix, '');
  });
});

