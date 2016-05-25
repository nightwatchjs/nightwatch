var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.containsText' : {
    'containsText assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/containsText.js');
      var client = {
        options : {},
        api : {
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
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('containsText', assertionFn, true, client);
      m._commandFn('.test_element', 'text result', 'Test message');
    },

    'containsText assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/containsText.js');
      var client = {
        options : {},
        api : {
          getText : function(cssSelector, callback) {
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
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('containsText', assertionFn, true, client);
      m._commandFn('.test_element', 'text result', 'Test message');
    },

    'containsText assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/containsText.js');
      var client = {
        options : {},
        api : {
          getText : function(cssSelector, callback) {
            callback({
              status : -1
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, 'text result');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('containsText', assertionFn, true, client);
      m._commandFn('.test_element', 'text result', 'Test message');
    }
  }
};

