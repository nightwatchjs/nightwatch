var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var Api = require('../../../'+BASE_PATH+'/core/api.js');
module.exports = {
  setUp: function (callback) {
    callback();
  },

  'matches assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/matches.js');
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
        test.equals(expected, 'ed text re');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('matches', assertionFn, true, client);
    m._commandFn('.test_element', 'ed text re', 'Test message');
  },

  'matches assertion passed, case-insensitive' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/matches.js');
    var client = {
      options : {},
      api : {
        getText : function(cssSelector, callback) {
          test.equals(cssSelector, '.test_element');
          callback({
            value : 'EXPECTED TEXT RESULT'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'EXPECTED TEXT RESULT');
        test.equals(expected, 'ed text re');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('matches', assertionFn, true, client);
    m._commandFn('.test_element', /ed text re/i, 'Test message');
  },

  'matches assertion passed, exact' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/matches.js');
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
        test.equals(expected, '^expected text result$');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('matches', assertionFn, true, client);
    m._commandFn('.test_element', /^expected text result$/, 'Test message');
  },

  'matches assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/matches.js');
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
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('matches', assertionFn, true, client);
    m._commandFn('.test_element', /text result/, 'Test message');
  },

  'matches assertion not found' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/matches.js');
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
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        delete assertionFn;
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('matches', assertionFn, true, client);
    m._commandFn('.test_element', /text result/, 'Test message');
  },

  tearDown : function(callback) {
    callback();
  }
}

