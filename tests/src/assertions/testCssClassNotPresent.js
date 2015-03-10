
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'cssClassNotPresent assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/cssClassNotPresent.js');
    var client = {
      options : {},
      api : {
        getAttribute : function(cssSelector, attribute, callback) {
          test.equals(cssSelector, '.test_element');
          test.equals(attribute, 'class');
          callback({
            value : 'other-css-class some-css-class'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'other-css-class some-css-class');
        test.equals(expected, 'without test-css-class');
        test.equals(msg, 'Testing if element <.test_element> does not have css class: "test-css-class".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('cssClassNotPresent', assertionFn, true, client);
    m._commandFn('.test_element', 'test-css-class');
  },

  'cssClassNotPresent assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/cssClassNotPresent.js');
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
        test.equals(passed, false);
        test.equals(result, 'test-css-class other-css-class');
        test.equals(expected, 'without test-css-class');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('cssClassNotPresent', assertionFn, true, client);
    m._commandFn('.test_element', 'test-css-class');
  },

  'cssClassNotPresent assertion not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/cssClassNotPresent.js');
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
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'without test-css-class');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('cssClassNotPresent', assertionFn, true, client);
    m._commandFn('.test_element', 'test-css-class');
  },

  tearDown : function(callback) {
    callback();
  }
};

