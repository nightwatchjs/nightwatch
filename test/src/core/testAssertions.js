var assert = require('assert');
var common = require('../../common.js');
var Api = common.require('core/api.js');

var Globals = require('../../lib/globals/expect.js');
var nock = require('nock');

module.exports = {
  'test Assertions' : {
    beforeEach: function (done) {
      Globals.beforeEach.call(this, done);
    },

    afterEach: function() {
      Globals.afterEach.call(this);
    },

    'Testing results module on failure' : function(done) {
      nock('http://localhost:10195')
        .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
        .reply(200, {
          status: 0,
          value: []
        });

      this.client.api.assert.elementPresent('#weblogin');
      this.client.once('nightwatch:finished', function(results, errors) {
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        assert.equal(results.tests[0].message, 'Testing if element <#weblogin> is present.');
        assert.equal(results.tests[0].failure, 'Expected "present" but got: "not present"');
        assert.ok('stackTrace' in results.tests[0]);
        done();
      });
      this.client.start();
    },

    'Testing results module on pass' : function(done) {
      nock('http://localhost:10195')
        .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
        .reply(200, {
          status: 0,
          state: 'success',
          value: [{ ELEMENT: '0' }]
        });

      this.client.api.assert.elementPresent('#weblogin');
      this.client.once('nightwatch:finished', function(results, errors) {
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        assert.equal(results.tests[0].message, 'Testing if element <#weblogin> is present.');
        assert.equal(results.tests[0].failure, false);
        assert.equal(results.tests[0].stackTrace, '');
        done();
      });
      this.client.start();
    },

    'Testing assertions loaded' : function() {
      var prop;
      for (prop in assert) {
        assert.ok(prop in this.client.api.assert);
      }
      for (prop in assert) {
        assert.ok(prop in this.client.api.verify);
      }
      assert.ok('elementPresent' in this.client.api.assert);
      assert.ok('elementPresent' in this.client.api.verify);

      assert.ok('elementNotPresent' in this.client.api.assert);
      assert.ok('elementNotPresent' in this.client.api.verify);

      assert.ok('containsText' in this.client.api.assert);
      assert.ok('containsText' in this.client.api.verify);

      assert.ok('attributeEquals' in this.client.api.assert);
      assert.ok('attributeEquals' in this.client.api.verify);

      assert.ok('cssClassPresent' in this.client.api.assert);
      assert.ok('cssClassPresent' in this.client.api.verify);

      assert.ok('cssClassNotPresent' in this.client.api.assert);
      assert.ok('cssClassNotPresent' in this.client.api.verify);

      assert.ok('cssProperty' in this.client.api.assert);
      assert.ok('cssProperty' in this.client.api.verify);

      assert.ok('valueContains' in this.client.api.assert);
      assert.ok('valueContains' in this.client.api.verify);

      assert.ok('visible' in this.client.api.assert);
      assert.ok('visible' in this.client.api.verify);

      assert.ok('hidden' in this.client.api.assert);
      assert.ok('hidden' in this.client.api.verify);

      assert.ok('title' in this.client.api.assert);
      assert.ok('title' in this.client.api.verify);

    },

    'Testing chai expect is loaded' : function() {
      assert.equal(typeof this.client.api.expect, 'function');
      assert.equal(typeof this.client.api.expect.element, 'function');

      var something = 'test';
      var expect = this.client.api.expect(something);
      assert.deepEqual(expect, require('chai').expect(something));

      var element = this.client.api.expect.element('body');
      assert.ok('attribute' in element);
      assert.ok('css' in element);
      assert.ok('enabled' in element);
      assert.ok('present' in element);
      assert.ok('selected' in element);
      assert.ok('text' in element);
      assert.ok('a' in element);
      assert.ok('an' in element);
      assert.ok('value' in element);
      assert.ok('visible' in element);

    },

    'Testing passed assertion retry' : function(done) {
      var assertionFn = common.require('api/assertions/containsText.js');
      var client = {
        options: {},
        api : {
          globals: {
            retryAssertionTimeout: 5
          },
          getText : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              value : 'expected text result'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'expected text result');
          assert.equal(expected, 'text result');
          assert.equal(abortOnFailure, true);
          assert.equal(msg.indexOf('Test message after'), 0);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('containsText', assertionFn, true, client);
      m._commandFn('.test_element', 'text result', 'Test message');
    },

    'Testing failed assertion retry' : function(done) {
      var assertionFn = common.require('api/assertions/containsText.js');
      var client = {
        options: {},
        api : {
          globals: { retryAssertionTimeout: 5 },
          getText : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              value : 'not_expected'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'not_expected');
          assert.equal(expected, 'text result');
          assert.equal(abortOnFailure, true);
          assert.equal(msg, 'Test message after 5 milliseconds.');
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('containsText', assertionFn, true, client);
      m._commandFn('.test_element', 'text result', 'Test message');
    }
  }
};
