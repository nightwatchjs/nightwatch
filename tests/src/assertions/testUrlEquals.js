
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Api = require('../../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  'urlEquals assertion passed' : function(test) {
    var assertionFn = require('../../../'+BASE_PATH + '/api/assertions/urlEquals.js');
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
        test.equals(expected, 'http://www.nightwatchjs.org');
        test.equals(msg, 'Testing if the URL equals "http://www.nightwatchjs.org".');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('urlEquals', assertionFn, true, client);
    m._commandFn('http://www.nightwatchjs.org');
  },

  'urlEquals assertion failed' : function(test) {
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
        test.equals(expected, 'http://www.google.com');
        test.equals(abortOnFailure, true);
        test.done();
      }
    };
    Api.init(client);
    var m = Api.createAssertion('urlEquals', assertionFn, true, client);
    m._commandFn('http://www.google.com');
  },

  tearDown : function(callback) {
    callback();
  }
};
