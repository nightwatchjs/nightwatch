var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.value' : {
    'value assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/value.js');
      var client = {
        options : {},
        api : {
          getValue : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              status : 0,
              value : 'some-value'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'some-value');
          assert.equal(expected, 'some-value');
          assert.equal(msg, 'Testing if value of <.test_element> equals: "some-value".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('value', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    },

    'value assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/value.js');
      var client = {
        options : {},
        api : {
          getValue : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              status : 0,
              value : 'wrong-value'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'wrong-value');
          assert.equal(expected, 'some-value');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('value', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    },

    'value assertion not found' : function(done) {
      var assertionFn = common.require('api/assertions/value.js');
      var client = {
        options : {},
        api : {
          getValue : function(cssSelector, callback) {
            callback({
              status : -1
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, 'some-value');
          assert.equal(msg, 'Testing if value of <.test_element> equals: "some-value". Element or attribute could not be located.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('value', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    }
  }
};

