var MockServer = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('waitForElementVisible', {

  'client.waitForElementVisible() failure': function (done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    var assertion = [];
    client.assertion = function (result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });

    api.globals.abortOnAssertionFailure = false;
    api.globals.waitForConditionPollInterval = 10;
    api.waitForElementVisible('#weblogin', 15, 10, function callback(result, instance) {
      assert.equal(assertion[0], false);
      assert.equal(assertion[1], 'not visible');
      assert.equal(assertion[4], false);
    });

    Nightwatch.start(function() {
      MockServer.removeMock({
        url: '/wd/hub/session/1352110219202/element/0/displayed',
        method: 'GET'
      });
      done();
    });
  },

  'client.waitForElementVisible() fail with global timeout default': function (done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();
    var assertion = [];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });
    client.assertion = function (result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    api.globals.waitForConditionTimeout = 15;
    api.globals.waitForConditionPollInterval = 10;
    api.waitForElementVisible('#weblogin', function callback(result, instance) {
      assert.equal(assertion[0], false);
      assert.equal(assertion[3], 'Timed out while waiting for element <#weblogin> to be visible for 15 milliseconds.');
      assert.equal(assertion[1], 'not visible');
    });

    Nightwatch.start(function() {
      MockServer.removeMock({
        url: '/wd/hub/session/1352110219202/element/0/displayed',
        method: 'GET'
      });
      done();
    });
  },

  'client.waitForElementVisible() fail with global timeout default and custom message': function (done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();
    var assertion = [];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });
    client.assertion = function (result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    api.globals.waitForConditionTimeout = 15;
    api.globals.waitForConditionPollInterval = 10;
    api.waitForElementVisible('#weblogin', function callback(result, instance) {
      assert.equal(assertion[3], 'Test message <#weblogin> and a global 15 ms.');
    }, 'Test message <%s> and a global %s ms.');

    Nightwatch.start(function() {
      MockServer.removeMock({
        url: '/wd/hub/session/1352110219202/element/0/displayed',
        method: 'GET'
      });
      done();
    });
  },

  'client.waitForElementVisible() StaleElementReference error': function (done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    var assertion = [];
    client.assertion = function (result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata : '{"using":"css selector","value":"#stale-element"}',
      method: 'POST',
      response: JSON.stringify({
        status: 0,
        state: 'success',
        value: [{ELEMENT: '99'}]
      })
    })
    .addMock({
      url: '/wd/hub/session/1352110219202/element/99/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        state: 'stale element reference',
        status: 10
      })
    }, true)
    .addMock({
      url: '/wd/hub/session/1352110219202/element/99/displayed',
      method: 'GET',
      response: JSON.stringify({
        state: 'success',
        status: 0,
        value: true
      })
    }, true);

    api.waitForElementVisible('#stale-element', 110, 10, function callback(result, instance) {
      assert.equal(assertion[0], true);
      assert.equal(result.value, true);
    });

    Nightwatch.start(function() {
      MockServer.removeMock({
        url: '/wd/hub/session/1352110219202/elements',
        method: 'POST'
      });
      done();
    });
  },

  'client.waitForElementVisible() fail with no args and global timeout not set': function (done) {
    var api = Nightwatch.api();
    api.globals.waitForConditionTimeout = null;

    Nightwatch.client().on('nightwatch:finished', function (results, errors) {
      assert.equal(results.errors, 1);
      assert.equal(errors.length, 1);
      assert.equal(errors[0].indexOf('Error while running waitForElementVisible command: waitForElement expects second parameter to have a global default (waitForConditionTimeout)'), 0);
    });

    api.waitForElementVisible('foo');
    Nightwatch.start(done);
  }
});
