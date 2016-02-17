var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = {
  'assert.urlContains' : {
    'urlContains assertion passed' : function(done) {
      var assertionFn = common.require('api/assertions/urlContains.js');
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
          assert.equal(expected, 'nightwatchjs');
          assert.equal(msg, 'Testing if the URL contains "nightwatchjs".');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('urlContains', assertionFn, true, client);
      m._commandFn('nightwatchjs');
    },

    'urlContains assertion failed' : function(done) {
      var assertionFn = common.require('api/assertions/urlContains.js');
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
          assert.equal(passed, false);
          assert.equal(result, 'http://www.nightwatchjs.org');
          assert.equal(expected, 'google');
          assert.equal(abortOnFailure, true);
          done();
        }
      };
      Api.init(client);
      var m = Api.createAssertion('urlContains', assertionFn, true, client);
      m._commandFn('google');
    }
  }
};
