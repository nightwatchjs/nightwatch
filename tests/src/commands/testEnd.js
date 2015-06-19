var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var nock = require('nock');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    client.end(function callback(result) {
      test.equals(result.state, 'success');
      test.strictEqual(client.sessionId, null);
      test.done();
    });
  },

  testCommandNoSessionId : function(test) {
    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    var client = this.client.api;
    client.end();

    client.end(function callback(result) {
      test.strictEqual(result, null);
      test.done();
    });
  },

  testCommandWithScreenshot : function(test) {
    this.client.results.failed = 1;
    this.client.options.screenshots = {
      enabled : true,
      on_failure : true,
      path : './screens'
    };

    this.client.api.currentTest = {
      module : 'test_module',
      name : 'test_name'
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
        status : 0,
        state: 'success',
        value : '==content'
      });

    this.client.saveScreenshotToFile = function(file, content, done) {
      test.equals(content, '==content');
      test.ok(file.indexOf('screens/test_module/test_name') > -1);
      setTimeout(function() {
        test.done();
      }, 10);
    };

    this.client.api.end(function callback(result) {
      test.equals(result.value, null);
    });
  },

  testCommandWithFailuresAndScreenshotDisabled : function(test) {
    this.client.results.failed = 1;
    this.client.options.screenshots = {
      enabled : true,
      on_failure : false,
      path : './screens'
    };

    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    this.client.api.end(function callback(result) {
      test.strictEqual(result.value, null);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;

    callback();
  }
};
