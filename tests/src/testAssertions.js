var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../' + BASE_PATH + '/core/api.js');
var nock = require('nock');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'Testing results module on failure' : function(test) {
    this.client = require('../nightwatch.js').init();

    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/element', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: -1,
        value: { ELEMENT: '0' }
      });

    this.client.api.assert.elementPresent('#weblogin');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(results.tests[0].message, 'Testing if element <#weblogin> is present.');
      test.equals(results.tests[0].failure, 'Expected "present" but got: "null"');
      test.ok('stacktrace' in results.tests[0]);
      test.done();
    })
  },

  'Testing results module on pass' : function(test) {
    this.client = require('../nightwatch.js').init();

    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/element', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: { ELEMENT: '0' }
      });

    this.client.api.assert.elementPresent('#weblogin');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(results.tests[0].message, 'Testing if element <#weblogin> is present.');
      test.equals(results.tests[0].failure, false);
      test.equals(results.tests[0].stacktrace, '');
      test.done();
    })
  },

  'Testing assertions loaded' : function(test) {
    this.client = require('../nightwatch.js').init({});
    var assertModule = require('assert');
    var prop;
    for (prop in assertModule) {
      test.ok(prop in this.client.api.assert);
    }
    for (prop in assertModule) {
      test.ok(prop in this.client.api.verify);
    }
    test.ok('elementPresent' in this.client.api.assert);
    test.ok('elementPresent' in this.client.api.verify);

    test.ok('elementNotPresent' in this.client.api.assert);
    test.ok('elementNotPresent' in this.client.api.verify);

    test.ok('containsText' in this.client.api.assert);
    test.ok('containsText' in this.client.api.verify);

    test.ok('attributeEquals' in this.client.api.assert);
    test.ok('attributeEquals' in this.client.api.verify);

    test.ok('cssClassPresent' in this.client.api.assert);
    test.ok('cssClassPresent' in this.client.api.verify);

    test.ok('cssClassNotPresent' in this.client.api.assert);
    test.ok('cssClassNotPresent' in this.client.api.verify);

    test.ok('cssProperty' in this.client.api.assert);
    test.ok('cssProperty' in this.client.api.verify);

    test.ok('valueContains' in this.client.api.assert);
    test.ok('valueContains' in this.client.api.verify);

    test.ok('visible' in this.client.api.assert);
    test.ok('visible' in this.client.api.verify);

    test.ok('hidden' in this.client.api.assert);
    test.ok('hidden' in this.client.api.verify);

    test.ok('title' in this.client.api.assert);
    test.ok('title' in this.client.api.verify);

    test.done();
  },

  'Testing passed assertion retry' : function(test) {
    var assertionFn = require('../../' + BASE_PATH + '/api/assertions/containsText.js');
    var client = {
      options: {},
      api : {
        globals: { retryAssertionTimeout: 5 },
        getText : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            value : 'expected text result'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'expected text result');
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        test.equal(msg.indexOf('Test message after'), 0);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('containsText', assertionFn, true, client);
    m._commandFn('.test_element', 'text result', 'Test message');
  },

  'Testing failed assertion retry' : function(test) {
    var assertionFn = require('../../' + BASE_PATH + '/api/assertions/containsText.js');
    var client = {
      options: {},
      api : {
        globals: { retryAssertionTimeout: 5 },
        getText : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            value : 'not_expected'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'not_expected');
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        test.equals(msg, 'Test message after 5 milliseconds.');
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('containsText', assertionFn, true, client);
    m._commandFn('.test_element', 'text result', 'Test message');
  },

  tearDown : function(callback) {
    // clean up
    this.client = null;
    callback();
  }
};
