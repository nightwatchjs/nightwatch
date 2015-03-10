
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'hidden assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/hidden.js');
    var client = {
      options : {},
      api : {
        isVisible : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            status : 0,
            value : false
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, true);
        test.equals(expected, true);
        test.equals(msg, 'Testing if element <.test_element> is hidden.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('hidden', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  'hidden assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/hidden.js');
    var client = {
      options : {},
      api : {
        isVisible : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            status : 0,
            value : true
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, false);
        test.equals(expected, true);
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('hidden', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  'hidden assertion not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/hidden.js');
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
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, true);
        test.equals(msg, 'Testing if element <.test_element> is hidden. Element could not be located.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('hidden', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  tearDown : function(callback) {
    callback();
  }
};

