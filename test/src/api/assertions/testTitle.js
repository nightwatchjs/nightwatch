var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.title' : {
    'title assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/title.js');
      var client = {
        options : {},
        api : {
          title : function(callback) {
            callback({
              value : 'Test Title'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, true);
          assert.equal(result, 'Test Title');
          assert.equal(expected, 'Test Title');
          assert.equal(msg, 'Testing if the page title equals "Test Title".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('title', assertionFn, true, client);
      m._commandFn('Test Title');
    },

    'title assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/title.js');
      var client = {
        options : {},
        api : {
          title : function(callback) {
            callback({
              value : 'Wrong Title'
            });
          }
        },
        assertion : function(passed, result, expected, msg, abortOnFailure) {
          assert.equal(passed, false);
          assert.equal(result, 'Wrong Title');
          assert.equal(expected, 'Test Title');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('title', assertionFn, true, client);
      m._commandFn('Test Title');
    }
  }
};

