var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.cssProperty' : {
    'cssProperty assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/cssProperty.js');
      var client = {
        options : {},
        api : {
          getCssProperty : function(cssSelector, property, callback) {
            assert.equal(cssSelector, '.test_element');
            assert.equal(property, 'display');
            callback({
              value : 'none'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'none');
          assert.equal(expected, 'none');
          assert.equal(msg, 'Testing if element <.test_element> has css property "display: none".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssProperty', assertionFn, true, client);
      m._commandFn('.test_element', 'display', 'none');
    },

    'cssProperty assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/cssProperty.js');
      var client = {
        options : {},
        api : {
          getCssProperty : function(cssSelector, property, callback) {
            assert.equal(cssSelector, '.test_element');
            assert.equal(property, 'display');
            callback({
              value : 'block'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'block');
          assert.equal(expected, 'none');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssProperty', assertionFn, true, client);
      m._commandFn('.test_element', 'display', 'none');
    },

    'cssProperty assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/cssProperty.js');
      var client = {
        options : {},
        api : {
          getCssProperty : function(cssSelector, property, callback) {
            callback({
              status : -1
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, 'none');
          assert.equal(msg, 'Testing if element <.test_element> has css property display. Element or attribute could not be located.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('cssProperty', assertionFn, true, client);
      m._commandFn('.test_element', 'display', 'none');
    }
  }
};

