var Api = require('../../../lib/api.js');
module.exports = {
  setUp: function (callback) {
    callback();
  },

  'notContainsText assertion passed' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/notContainsText.js');
    var client = {
      options : {},
      api : {
        getText : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            value : 'expected text result'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'expected text result');
        test.equals(expected, 'not bad result');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('notContainsText', assertionFn, true, client);
    m._commandFn('.test_element', 'bad result', 'Test message');
  },

  'notContainsText assertion failed' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/notContainsText.js');
    var client = {
      options : {},
      api : {
        getText : function(cssSelector, callback) {
          callback({
            value : 'not_expected'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'not_expected');
        test.equals(expected, 'not expected');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('notContainsText', assertionFn, true, client);
    m._commandFn('.test_element', 'expected', 'Test message');
  },

  'notContainsText assertion not found' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/notContainsText.js');
    var client = {
      options : {},
      api : {
        getText : function(cssSelector, callback) {
          callback({
            status : -1
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'not text result');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('notContainsText', assertionFn, true, client);
    m._commandFn('.test_element', 'text result', 'Test message');
  },

  tearDown : function(callback) {
    callback();
  }
}

