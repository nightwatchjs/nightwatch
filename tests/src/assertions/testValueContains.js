
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'valueContains assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/valueContains.js');
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
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('valueContains', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'valueContains assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/valueContains.js');
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
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('valueContains', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'valueContains assertion element not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/valueContains.js');
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
        test.equals(msg, 'Testing if value of <.test_element> contains: "some-value". Element could not be located.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('valueContains', assertionFn, true, client);
    m._commandFn('.test_element', 'some-value');
  },

  'valueContains assertion value attribute not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/valueContains.js');
    var client = {
      options : {},
      api : {
        getValue : function(cssSelector, callback) {
          callback({
            status : 0,
            value : null
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, true);
        test.equals(msg, 'Testing if value of <.test_element> contains: "some-value". Element does not have a value attribute.');
        test.equals(abortOnFailure, true);
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
};

