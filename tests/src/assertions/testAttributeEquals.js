
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../'+BASE_PATH+'/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'attributeEquals assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/attributeEquals.js');
    var client = {
      options : {},
      api : {
        getAttribute : function(cssSelector, attribute, callback) {
          test.equals(cssSelector, '.test_element');
          test.equals(attribute, 'role');
          callback({
            value : 'main'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'main');
        test.equals(expected, 'main');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('attributeEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main', 'Test message');
  },

  'attributeEquals assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/attributeEquals.js');
    var client = {
      options : {},
      api : {
        getAttribute : function(cssSelector, attribute, callback) {
          callback({
            value : 'not_expected'
          });
        }
      },

      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'not_expected');
        test.equals(expected, 'main');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };

    Api.init(client);
    var m = Api.createAssertion('attributeEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main', 'Test message');
  },

  'attributeEquals assertion not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/attributeEquals.js');
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
        test.equals(expected, 'main');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };

    Api.init(client);
    var m = Api.createAssertion('attributeEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main', 'Test message');
  },

  'attributeEquals assertion value attribute not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/attributeEquals.js');
    var client = {
      options : {},
      api : {
        getAttribute : function(cssSelector, attribute, callback) {
          callback({
            status : 0,
            value : null
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'main');
        test.equals(msg, 'Testing if attribute role of <.test_element> equals "main". Element does not have a role attribute.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('attributeEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main');
  },

  tearDown : function(callback) {
    callback();
  }
};

