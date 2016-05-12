var assert = require('assert');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var Globals = require('../../../lib/globals.js');
var Nocks = require('../../../lib/nocks.js');
var nock = require('nock');

module.exports = {
  'end' : {
    beforeEach: function (done) {
      Globals.interceptStartFn();
      Nocks.cleanAll().createSession();
      Nightwatch.init({}, function () {
        done();
      });
      this.api = Nightwatch.api();
    },

    afterEach: function () {
      Globals.restoreStartFn();
    },

    'client.end();': function (done) {
      nock('http://localhost:10195')
        .delete('/wd/hub/session/1352110219202')
        .reply(200, {
          status: 0,
          state: 'success',
          value: null
        });

      this.api.end(function callback(result) {
        assert.equal(result.state, 'success');
        assert.strictEqual(this.api.sessionId, null);
      }.bind(this));

      Nightwatch.start(done);
    },

    'client.end() - no session id': function (done) {
      nock('http://localhost:10195')
        .delete('/wd/hub/session/1352110219202')
        .times(2)
        .reply(200, {
          status: 0,
          state: 'success',
          value: null
        });

      this.api.end();

      this.api.end(function callback(result) {
        assert.strictEqual(result, null);
      });

      Nightwatch.start(done);
    },

    'client.end() - with screenshot': function (done) {
      var client = Nightwatch.client();

      client.results.failed = 1;
      client.options.screenshots = {
        enabled: true,
        on_failure: true,
        path: './screens'
      };

      client.api.currentTest = {
        module: 'test_module',
        name: 'test_name'
      };

      nock('http://localhost:10195')
        .delete('/wd/hub/session/1352110219202')
        .reply(200, {
          status: 0,
          state: 'success',
          value: null
        });

      nock('http://localhost:10195')
        .get('/wd/hub/session/1352110219202/screenshot')
        .reply(200, {
          status: 0,
          state: 'success',
          value: '==content'
        });

      client.saveScreenshotToFile = function (file, content) {
        assert.equal(content, '==content');
        assert.ok(file.indexOf('screens/test_module/test_name') > -1);
        setTimeout(function () {
          done();
        }, 10);
      };

      client.api.end(function callback(result) {
        assert.equal(result.value, null);
      });

      Nightwatch.start();
    },

    'client.end() - failures and screenshots disabled': function (done) {
      var client = Nightwatch.client();

      client.results.failed = 1;
      client.currentTest = {
        module: 'test_module',
        name: 'test_name'
      };
      client.options.screenshots = {
        enabled: true,
        on_failure: false,
        path: './screens'
      };

      nock('http://localhost:10195')
        .delete('/wd/hub/session/1352110219202')
        .reply(200, {
          status: 0,
          state: 'success',
          value: null
        });

      client.api.end(function callback(result) {
        assert.strictEqual(result.value, null);
      });

      Nightwatch.start(done);
    }
  }
};
