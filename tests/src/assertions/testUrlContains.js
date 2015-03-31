
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'urlContains assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/urlContains.js');
    var client = {
      options : {},
      api : {
        url : function(callback) {
          callback({
            value : 'http://www.nightwatchjs.org'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'http://www.nightwatchjs.org');
        test.equals(expected, 'nightwatchjs');
        test.equals(msg, 'Testing if the URL contains "nightwatchjs".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('urlContains', assertionFn, true, client);
    m._commandFn('nightwatchjs');
  },

  'urlContains assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/urlContains.js');
    var client = {
      options : {},
      api : {
        url : function(callback) {
          callback({
            value : 'http://www.nightwatchjs.org'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'http://www.nightwatchjs.org');
        test.equals(expected, 'google');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('urlContains', assertionFn, true, client);
    m._commandFn('google');
  },

  tearDown : function(callback) {
    callback();
  }
};
