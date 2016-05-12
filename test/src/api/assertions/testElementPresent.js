var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.elementPresent' : {
    'elementPresent assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/elementPresent.js');
      var client = {
        options : {},
        locateStrategy : 'css selector',
        api : {
          elements : function(using, selector, callback) {
            assert.equal(selector, '.test_element');
            assert.equal(using, 'css selector');
            callback({
              status : 0,
              value : [{
                ELEMENT : '0'
              }]
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'present');
          assert.equal(expected, 'present');
          assert.equal(msg, 'Testing if element <.test_element> is present.');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('elementPresent', assertionFn, true, client);
      m._commandFn('.test_element');
    },

    'elementPresent assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/elementPresent.js');
      var client = {
        options : {},
        locateStrategy : 'css selector',
        api : {
          elements : function(using, selector, callback) {
            assert.equal(selector, '.test_element');
            assert.equal(using, 'css selector');
            callback({
              status : 0,
              value : []
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'not present');
          assert.equal(expected, 'present');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('elementPresent', assertionFn, true, client);
      m._commandFn('.test_element');
    }
  }
};
