
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'cssProperty assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/cssProperty.js');
    var client = {
      options : {},
      api : {
        getCssProperty : function(cssSelector, property, callback) {
          test.equals(cssSelector, '.test_element');
          test.equals(property, 'display');
          callback({
            value : 'none'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'none');
        test.equals(expected, 'none');
        test.equals(msg, 'Testing if element <.test_element> has css property "display: none".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('cssProperty', assertionFn, true, client);
    m._commandFn('.test_element', 'display', 'none');
  },

  'cssProperty assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/cssProperty.js');
    var client = {
      options : {},
      api : {
        getCssProperty : function(cssSelector, property, callback) {
          test.equals(cssSelector, '.test_element');
          test.equals(property, 'display');
          callback({
            value : 'block'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'block');
        test.equals(expected, 'none');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('cssProperty', assertionFn, true, client);
    m._commandFn('.test_element', 'display', 'none');
  },

  'cssProperty assertion not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/cssProperty.js');
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
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'none');
        test.equals(msg, 'Testing if element <.test_element> has css property display. Element or attribute could not be located.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('cssProperty', assertionFn, true, client);
    m._commandFn('.test_element', 'display', 'none');
  },

  tearDown : function(callback) {
    callback();
  }
};

