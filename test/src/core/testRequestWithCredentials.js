var assert = require('assert');
var Globals = require('../../lib/globals.js');
var Nocks = require('../../lib/nocks.js');
var Nightwatch = require('../../lib/nightwatch.js');

module.exports = {
  'test Request With Credentials' : {
    beforeEach: function () {
      Globals.interceptStartFn();
      Nocks.cleanAll().createSession();
    },

    afterEach: function () {
      Nocks.deleteSession();
      Globals.restoreStartFn();
    },

    'Test initialization with credentials': function (done) {
      var client = Nightwatch.createClient({
        selenium_port: 10195,
        silent: true,
        output: false,
        username: 'testusername',
        access_key: '123456'
      });

      client.on('selenium:session_create', function (sessionId, request) {
        var authorization = new Buffer('testusername:123456').toString('base64');
        assert.equal(request.request._headers['authorization'], 'Basic ' + authorization, 'Testing if the Authorization header is set correctly');
        done();
      });

      client.startSession();
    }
  }
};
