var Api = require('../../../lib/api.js');
module.exports = {
  setUp: function (callback) {
    callback();
  },

  'attributeNotEquals assertion passed' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/attributeNotEquals.js');
    var client = {
      options : {},
      api : {
        getAttribute : function(cssSelector, attribute, callback) {
          test.equals(cssSelector, '.test_element');
          test.equals(attribute, 'role');
          callback({
            value : 'not main'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'not main');
        test.equals(expected, 'not main');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('attributeNotEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main', 'Test message');
  },

  'attributeNotEquals assertion failed' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/attributeNotEquals.js');
    var client = {
      options : {},
      api : {
        getAttribute : function(cssSelector, attribute, callback) {
          callback({
            value : 'main'
          });
        }
      },

      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'main');
        test.equals(expected, 'not main');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };

    Api.init(client);
    var m = Api.createAssertion('attributeNotEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main', 'Test message');
  },

  'attributeNotEquals assertion not found' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/attributeNotEquals.js');
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
        test.equals(expected, 'not main');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };

    Api.init(client);
    var m = Api.createAssertion('attributeNotEquals', assertionFn, true, client);
    m._commandFn('.test_element', 'role', 'main', 'Test message');
  },

  tearDown : function(callback) {
    callback();
  }
}

