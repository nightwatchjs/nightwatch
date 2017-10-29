const assert = require('assert');
const MockServer  = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');
const common = require('../../common.js');
const HttpRequest = common.require('http/request.js');

module.exports = {
  'test NightwatchIndex': {
    before: function (done) {
      this.server = MockServer.init();
      this.server.on('listening', function () {
        done();
      });
    },
    after: function (done) {
      Nightwatch.createClient({
        default_path_prefix: '/wd/hub'
      });
      this.server.close(function () {
        done();
      });
    },

    testDefaultPathPrefix: function () {
      var client = Nightwatch.createClient();

      var request = new HttpRequest({
        host: '127.0.0.1',
        path: '/test'
      });

      assert.strictEqual(request.defaultPathPrefix, '/wd/hub');
    },

    testSetDefaultPathPrefixOption: function () {
      var client = Nightwatch.createClient({
        default_path_prefix: '/test'
      });

      var request = new HttpRequest({
        host: '127.0.0.1',
        path: '/test',
        port: 10195
      });

       assert.strictEqual(request.defaultPathPrefix, '');
    },

    testSetDefaultPathPrefixInvalidOption: function () {
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
    },

    testSetDefaultPathPrefixEmptyOption: function () {
      var client = Nightwatch.createClient({
        default_path_prefix: ''
      });

      var request = new HttpRequest({
        host: '127.0.0.1',
        path: '/test',
        port: 10195
      });
      assert.strictEqual(request.defaultPathPrefix, '');
    },
  }
};
