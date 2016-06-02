var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.visible' : {
    'visible assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/visible.js');
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
          assert.equal(passed, true);
          assert.equal(result, true);
          assert.equal(expected, true);
          assert.equal(msg, 'Testing if element <.test_element> is visible.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('visible', assertionFn, true, client);
      m._commandFn('.test_element');
    },

    'visible assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/visible.js');
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
          assert.equal(passed, false);
          assert.equal(result, false);
          assert.equal(expected, true);
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('visible', assertionFn, true, client);
      m._commandFn('.test_element');
    },

    'visible assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/visible.js');
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
          assert.equal(msg, 'Testing if element <.test_element> is visible. Element could not be located.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('visible', assertionFn, true, client);
      m._commandFn('.test_element');
    }
  }
};

