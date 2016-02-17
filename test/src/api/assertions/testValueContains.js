var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.valueContains' : {
    'valueContains assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/valueContains.js');
      var client = {
        options : {},
        api : {
          getValue : function(cssSelector, callback) {
            assert.equal(cssSelector, '.test_element');
            callback({
              status : 0,
              value : 'contains-some-value'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'contains-some-value');
          assert.equal(expected, true);
          assert.equal(msg, 'Testing if value of <.test_element> contains: "some-value".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('valueContains', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    },

    'valueContains assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/valueContains.js');
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
          assert.equal(expected, true);
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('valueContains', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    },

    'valueContains assertion element not found' : function(done) {
      var assertionFn = common.require('api/assertions/valueContains.js');
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
          assert.equal(expected, true);
          assert.equal(msg, 'Testing if value of <.test_element> contains: "some-value". Element could not be located.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('valueContains', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    },

    'valueContains assertion value attribute not found' : function(done) {
      var assertionFn = common.require('api/assertions/valueContains.js');
      var client = {
        options : {},
        api : {
          getValue : function(cssSelector, callback) {
            callback({
              status : 0,
              value : null
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, null);
          assert.equal(expected, true);
          assert.equal(msg, 'Testing if value of <.test_element> contains: "some-value". Element does not have a value attribute.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('valueContains', assertionFn, true, client);
      m._commandFn('.test_element', 'some-value');
    }
  }
};

