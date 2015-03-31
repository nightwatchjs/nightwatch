
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'elementPresent assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/elementPresent.js');
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
        test.equals(passed, true);
        test.equals(result, '0');
        test.equals(expected, 'present');
        test.equals(msg, 'Testing if element <.test_element> is present.');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('elementPresent', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  'elementPresent assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/elementPresent.js');
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
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'present');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('elementPresent', assertionFn, true, client);
    m._commandFn('.test_element');
  },

  tearDown : function(callback) {
    callback();
  }
};
