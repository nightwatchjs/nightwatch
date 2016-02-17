var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.cssClassNotPresent' : {
    'cssClassNotPresent assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/cssClassNotPresent.js');
      var client = {
        options : {},
        api : {
          getAttribute : function(cssSelector, attribute, callback) {
            assert.equal(cssSelector, '.test_element');
            assert.equal(attribute, 'class');
            callback({
              value : 'other-css-class some-css-class'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'other-css-class some-css-class');
          assert.equal(expected, 'without test-css-class');
          assert.equal(msg, 'Testing if element <.test_element> does not have css class: "test-css-class".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssClassNotPresent', assertionFn, true, client);
      m._commandFn('.test_element', 'test-css-class');
    },

    'cssClassNotPresent assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/cssClassNotPresent.js');
      var client = {
        options : {},
        api : {
          getAttribute : function(cssSelector, attribute, callback) {
            callback({
              value : 'test-css-class other-css-class'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'test-css-class other-css-class');
          assert.equal(expected, 'without test-css-class');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssClassNotPresent', assertionFn, true, client);
      m._commandFn('.test_element', 'test-css-class');
    },

    'cssClassNotPresent assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/cssClassNotPresent.js');
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
          assert.equal(expected, 'without test-css-class');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssClassNotPresent', assertionFn, true, client);
      m._commandFn('.test_element', 'test-css-class');
    }
  }
};

