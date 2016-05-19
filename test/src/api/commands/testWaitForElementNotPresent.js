var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('waitForElementNotPresent', {

  'client.waitForElementNotPresent() success' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    var assertion = [];
    client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    api.globals.waitForConditionPollInterval = 10;
    api.waitForElementNotPresent('.weblogin', 10, 5, function callback(result, instance) {
      assert.equal(instance.expectedValue, 'not found');
      assert.equal(instance.rescheduleInterval, 5);

      assert.equal(assertion[0], true);
      assert.equal(assertion[3].indexOf('Element <.weblogin> was not present after'), 0);
      assert.equal(assertion[4], true); // abortOnFailure
      done();
    });

    Nightwatch.start();
  },

  'client.waitForElementNotPresent() failure no abort' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    var assertion = [];
    client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    api.globals.waitForConditionPollInterval = 10;
    api.waitForElementNotPresent('#weblogin', 15, false, function callback(result) {
      assert.equal(result.status, 0);
      assert.equal(assertion[4], false); // abortOnFailure
      done();
    });

    Nightwatch.start();
  },

  'client.waitForElementNotPresent() failure no abort with custom interval' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    var assertion = [];
    client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    api.globals.waitForConditionPollInterval = 10;
    api.waitForElementNotPresent('#weblogin', 15, 10, false, function callback(result) {
      assert.equal(result.status, 0);
      assert.equal(assertion[4], false); // abortOnFailure
      done();
    });

    Nightwatch.start();
  }
});
