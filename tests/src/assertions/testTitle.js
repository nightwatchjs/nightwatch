
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'title assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/title.js');
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
        test.equals(passed, true);
        test.equals(result, 'Test Title');
        test.equals(expected, 'Test Title');
        test.equals(msg, 'Testing if the page title equals "Test Title".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('title', assertionFn, true, client);
    m._commandFn('Test Title');
  },

  'title assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/title.js');
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
        test.equals(passed, false);
        test.equals(result, 'Wrong Title');
        test.equals(expected, 'Test Title');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('title', assertionFn, true, client);
    m._commandFn('Test Title');
  },

  tearDown : function(callback) {
    callback();
  }
};

