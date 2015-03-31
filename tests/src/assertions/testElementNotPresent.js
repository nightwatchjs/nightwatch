
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'elementNotPresent assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/elementNotPresent.js');
    var client = {
      options : {},
      locateStrategy : 'css selector',
      api : {
        element : function(using, selector, callback) {
          test.equals(selector, '.test_element');
          test.equals(using, 'css selector');
          callback({
            status : -1
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, null);
        test.equals(expected, 'not present');
        test.equals(msg, 'Testing if element <.test_element> is not present.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('elementNotPresent', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  'elementNotPresent assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/elementNotPresent.js');
    var client = {
      options : {},
      locateStrategy : 'css selector',
      api : {
        element : function(using, selector, callback) {
          test.equals(selector, '.test_element');
          test.equals(using, 'css selector');
          callback({
            status : 0,
            value : {
              ELEMENT : '0'
            }
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, '0');
        test.equals(expected, 'not present');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('elementNotPresent', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  tearDown : function(callback) {
    callback();
  }
};
