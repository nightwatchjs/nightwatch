
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'urlMatches assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/urlMatches.js');
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
        test.equals(expected.toString(), /nightwatchjs\.org/.toString());
        test.equals(msg, 'Testing if the URL matches "/nightwatchjs\\.org/".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('urlMatches', assertionFn, true, client);
    m._commandFn(/nightwatchjs\.org/);
  },

  'urlMatches assertion failed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/title.js');
    var client = {
      options : {},
      api : {
        title : function(callback) {
          callback({
            value : 'http://www.nightwatchjs.org'
          });
        }
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'http://www.nightwatchjs.org');
        test.equals(expected.toString(), /google\.com/.toString());
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('urlMatches', assertionFn, true, client);
    m._commandFn(/google\.com/);
  },

  tearDown : function(callback) {
    callback();
  }
};
