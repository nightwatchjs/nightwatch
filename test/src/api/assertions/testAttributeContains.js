var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.attributeContains' : {
    'attributeContains assertion passed': function(done) {
      var assertionFn = common.require('api/assertions/attributeContains.js');
      var client = {
        options: {},
        api: {
          getAttribute: function(cssSelector, attribute, callback) {
            assert.equal(cssSelector, '.test_element');
            assert.equal(attribute, 'href');
            callback({
              value: 'http://www.google.com'
            });
          }
        },
        assertion: function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'http://www.google.com');
          assert.equal(expected, 'google');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('attributeContains', assertionFn, true, client);
      m._commandFn('.test_element', 'href', 'google', 'Test message');
    },

    'attributeContains assertion failed': function(done) {
      var assertionFn = common.require('api/assertions/attributeContains.js');
      var client = {
        options: {},
        api: {
          getAttribute: function(cssSelector, attribute, callback) {
            callback({
              value: 'not_expected'
            });
          }
        },

        assertion: function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'not_expected');
          assert.equal(expected, 'whatever');
          assert.equal(abortOnFailure, true);
          done();
        }
      };

      Api.init(client);
      var m = Api.createAssertion('attributeContains', assertionFn, true, client);
      m._commandFn('.test_element', 'role', 'whatever', 'Test message');
    },

    'attributeContains assertion not found': function(done) {
      var assertionFn = common.require('api/assertions/attributeContains.js');
      var client = {
        options: {},
        api: {
          getAttribute: function(cssSelector, attribute, callback) {
            callback({
              status: -1
            });
          }
        },
        assertion: function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, 'main');
          assert.equal(abortOnFailure, true);
          done();
        }
      };

      Api.init(client);
      var m = Api.createAssertion('attributeContains', assertionFn, true, client);
      m._commandFn('.test_element', 'role', 'main');
    },

    'attributeContains assertion value attribute not found' : function(done) {
      var assertionFn = common.require('api/assertions/attributeContains.js');
      var client = {
        options : {},
        api : {
          getAttribute : function(cssSelector, attribute, callback) {
            callback({
              status : 0,
              value : null
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, 'main');
          assert.equal(msg, 'Testing if attribute role of <.test_element> contains "main". Element does not have a role attribute.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('attributeContains', assertionFn, true, client);
      m._commandFn('.test_element', 'role', 'main');
    }
  }
};

