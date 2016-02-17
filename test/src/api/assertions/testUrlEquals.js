var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.urlEquals' : {
    'urlEquals assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/urlEquals.js');
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
          assert.equal(passed, true);
          assert.equal(result, 'http://www.nightwatchjs.org');
          assert.equal(expected, 'http://www.nightwatchjs.org');
          assert.equal(msg, 'Testing if the URL equals "http://www.nightwatchjs.org".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('urlEquals', assertionFn, true, client);
      m._commandFn('http://www.nightwatchjs.org');
    },

    'urlEquals assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/title.js');
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
          assert.equal(passed, false);
          assert.equal(result, 'http://www.nightwatchjs.org');
          assert.equal(expected, 'http://www.google.com');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('urlEquals', assertionFn, true, client);
      m._commandFn('http://www.google.com');
    }
  }
};
