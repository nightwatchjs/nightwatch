const assert = require('assert');
const MockServer = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');
const common = require('../../common.js');
const HttpRequest = common.require('http/request.js');

describe('test NightwatchIndex', function () {
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
    this.server.close(function () {
      done();
    });
  });

  it('testDefaultPathPrefix', function () {
    var client = Nightwatch.createClient({
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
    var client = Nightwatch.createClient({
      default_path_prefix: '/test'
    });

    var request = new HttpRequest({
      host: '127.0.0.1',
      path: '/test',
      port: 10195
    });

    assert.strictEqual(request.defaultPathPrefix, '');
  });

  it('testSetDefaultPathPrefixInvalidOption', function () {
    Nightwatch.createClient({
      default_path_prefix: '/wd/hub'
    });

    var eq = assert.equal;
    var request = new HttpRequest({
      host: '127.0.0.1',
      path: '/session',
      port: 10195
    });
    eq(request.defaultPathPrefix, '/wd/hub');
    HttpRequest.globalSettings = {
      default_path: ''
    };
  });

  it('testSetDefaultPathPrefixEmptyOption', function () {
    var request = new HttpRequest({
      host: '127.0.0.1',
      path: '/test',
      port: 10195
    });
    assert.strictEqual(request.defaultPathPrefix, '');
  });
});

