var assert = require('assert');
var nock = require('nock');
var Globals = require('../../lib/globals.js');
var Nocks = require('../../lib/nocks.js');
var Nightwatch = require('../../lib/nightwatch.js');

module.exports = {
  'test Request With Credentials' : {
    beforeEach: function () {
      Globals.interceptStartFn();
      Nocks.cleanAll();
      nock('http://localhost:10195')
        .post('/wd/hub/session')
        .basicAuth({
          user: 'testusername',
          pass: '123456'
        })
        .reply(201, {
          status: 0,
          sessionId: '1352110219202',
          value: {
            javascriptEnabled: true,
            browserName: "firefox",
            version: "TEST",
            platform: "TEST"
          }
        });
    },

    afterEach: function () {
      Nocks.deleteSession();
      Globals.restoreStartFn();
    },

    'Test initialization with credentials': function (done) {
      var client = Nightwatch.createClient({
        selenium_port: 10195,
        silent: false,
        output: false,
        username: 'testusername',
        access_key: '123456'
      });

      client.on('nightwatch:session.create', function (data) {
        assert.equal(data.sessionId, '1352110219202');
        done();
      });

      client.startSession();
    }
  }
};
