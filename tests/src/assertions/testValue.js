
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'value assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/value.js');
    var client = {
      options : {},
      api : {
        getValue : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            status : 0,
            value : 'some-value'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'some-value');
        test.equals(expected, 'some-value');
        test.equals(msg, 'Testing if value of <.test_element> equals: "some-value".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('value', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'value assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/value.js');
    var client = {
      options : {},
      api : {
        getValue : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            status : 0,
            value : 'wrong-value'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'wrong-value');
        test.equals(expected, 'some-value');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('value', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'value assertion not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/value.js');
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
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'some-value');
        test.equals(msg, 'Testing if value of <.test_element> equals: "some-value". Element or attribute could not be located.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('value', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  tearDown : function(callback) {
    callback();
  }
};

