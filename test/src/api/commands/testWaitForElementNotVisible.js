var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');


module.exports = MochaTest.add('waitForElementNotVisible', {
  afterEach : function() {
    MockServer.removeMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET'
    });
  },

  'client.waitForElementNotVisible() success' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();
    var assertion = [];

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : false
      })
    });

    client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    api.globals.abortOnAssertionFailure = false;
    api.waitForElementNotVisible('#weblogin', 110, 50, function callback(result, instance) {
      assert.equal(assertion[0], true);
      assert.equal(assertion[4], false);

      done();
    });

    Nightwatch.start();
  },

  'client.waitForElementNotVisible() failure' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();
    var assertion = [];

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : true
      })
    });

    api.globals.abortOnAssertionFailure = true;
    client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    api.waitForElementNotVisible('#weblogin', 15, 10, function callback(result) {
      assert.equal(assertion[0], false);
      assert.equal(assertion[1], 'visible');
      assert.equal(assertion[2], 'not visible');
      assert.equal(assertion[3], 'Timed out while waiting for element <#weblogin> to not be visible for 15 milliseconds.');
      assert.equal(assertion[4], true); // abortOnFailure
      assert.equal(result.status, 0);
      done();
    });

    Nightwatch.start();
  }
});

