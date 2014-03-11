var Api = require('../../../lib/api.js');
module.exports = {
  setUp: function (callback) {
    callback();
  },

  'valueContains assertion passed' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/valueContains.js');
    var client = {
      options : {},
      api : {
        getValue : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            status : 0,
            value : 'contains-some-value'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'contains-some-value');
        test.equals(expected, true);
        test.equals(msg, 'Testing if value of <.test_element> contains: "some-value".');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('valueContains', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'valueContains assertion failed' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/valueContains.js');
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
        test.equals(expected, true);
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('valueContains', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'valueContains assertion not found' : function(test) {
    var assertionFn = require('../../../lib/selenium/assertions/valueContains.js');
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
        test.equals(expected, true);
        test.equals(msg, 'Testing if value of <.test_element> contains: "some-value". Element or attribute could not be located.');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('valueContains', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  tearDown : function(callback) {
    callback();
  }
}

