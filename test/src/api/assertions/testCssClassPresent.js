var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.cssClassPresent' : {
    'cssClassPresent assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/cssClassPresent.js');
      var client = {
        options : {},
        api : {
          getAttribute : function(cssSelector, attribute, callback) {
            assert.equal(cssSelector, '.test_element');
            assert.equal(attribute, 'class');
            callback({
              value : 'other-css-class test-css-class'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'other-css-class test-css-class');
          assert.equal(expected, 'has test-css-class');
          assert.equal(msg, 'Testing if element <.test_element> has css class: "test-css-class".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssClassPresent', assertionFn, true, client);
      m._commandFn('.test_element', 'test-css-class');
    },

    'cssClassPresent assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/cssClassPresent.js');
      var client = {
        options : {},
        api : {
          getAttribute : function(cssSelector, attribute, callback) {
            callback({
              value : 'other-css-class'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'other-css-class');
          assert.equal(expected, 'has test-css-class');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssClassPresent', assertionFn, true, client);
      m._commandFn('.test_element', 'test-css-class');
    },

    'cssClassPresent assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/cssClassPresent.js');
      var client = {
        options : {},
        api : {
          getAttribute : function(cssSelector, attribute, callback) {
            callback({
              status : -1
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, 'has test-css-class');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssClassPresent', assertionFn, true, client);
      m._commandFn('.test_element', 'test-css-class');
    }
  }
};

