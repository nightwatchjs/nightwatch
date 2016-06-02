var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.hidden' : {
    'hidden assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/hidden.js');
      var client = {
        options : {},
        api : {
          isVisible : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              status : 0,
              value : false
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, true);
          assert.equal(expected, true);
          assert.equal(msg, 'Testing if element <.test_element> is hidden.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('hidden', assertionFn, true, client);
      m._commandFn('.test_element');
    },

    'hidden assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/hidden.js');
      var client = {
        options : {},
        api : {
          isVisible : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              status : 0,
              value : true
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, false);
          assert.equal(expected, true);
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('hidden', assertionFn, true, client);
      m._commandFn('.test_element');
    },

    'hidden assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/hidden.js');
      var client = {
        options : {},
        api : {
          isVisible : function(cssSelector, callback) {
            callback({
              status : -1
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, true);
          assert.equal(msg, 'Testing if element <.test_element> is hidden. Element could not be located.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('hidden', assertionFn, true, client);
      m._commandFn('.test_element');
    }
  }
};

