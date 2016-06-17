var os     = require('os');
var path   = require('path');
var fs     = require('fs');
var mockery = require('mockery');
var assert = require('assert');

var MockServer  = require('../../lib/mockserver.js');
var Nightwatch = require('../../lib/nightwatch.js');

module.exports = {
  'test NightwatchIndex' : {
    before : function(done) {
      this.server = MockServer.init();
      this.server.on('listening', function() {
        done();
      });
    },
    after : function(done) {
      Nightwatch.createClient({
        default_path_prefix : '/wd/hub'
      });
      this.server.close(function() {
        done();
      });
    },

    testSetDefaultPathPrefixOption: function () {
      var client = Nightwatch.createClient({
        default_path_prefix : '/test'
      });

      var eq = assert.equal;
      var request = client.runProtocolAction({
        host: '127.0.0.1',
        path: '/session',
        port: 10195
      });
      eq(request.defaultPathPrefix, '/test');
    },

    testSetDefaultPathPrefixInvalidOption: function () {
      Nightwatch.createClient({
        default_path_prefix : '/wd/hub'
      });

      var client = Nightwatch.createClient({
        default_path_prefix : true
      });

      var eq = assert.equal;
      var request = client.runProtocolAction({
        host: '127.0.0.1',
        path: '/session',
        port: 10195
      });
      eq(request.defaultPathPrefix, '/wd/hub');
    },

    testSetDefaultPathPrefixEmptyOption: function () {
      var client = Nightwatch.createClient({
        default_path_prefix : ''
      });

      var eq = assert.equal;
      var request = client.runProtocolAction({
        host: '127.0.0.1',
        path: '/test',
        port: 10195
      });
      eq(request.defaultPathPrefix, '');
    },
  }
};
