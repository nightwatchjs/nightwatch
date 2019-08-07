const assert = require('assert');
const common = require('../../../common.js');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');
const NightwatchAssertion = common.require('core/assertion.js');

describe('waitForElementVisible', function() {
  const createOrig = NightwatchAssertion.create;

  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementVisible() failure', function(done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return createOrig(...args);
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

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementVisible('#weblogin', 15, 10, function (result, instance) {
      assert.strictEqual(assertion[0], false);
      assert.strictEqual(assertion[1].actual, 'not visible');
      assert.strictEqual(assertion[4], false);
      NightwatchAssertion.create = createOrig;
    });

    this.client.start(done);
  });

  it('client.waitForElementVisible() fail with global timeout default', function (done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return {
        run: function() {
          return Promise.resolve();
        }
      };
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

    this.client.api.globals.waitForConditionTimeout = 15;
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementVisible('#weblogin', function callback(result, instance) {
      try {
        assert.strictEqual(assertion[0], false);
        assert.strictEqual(assertion[3], 'Timed out while waiting for element <#weblogin> to be visible for 15 milliseconds.');
        assert.strictEqual(assertion[1].actual, 'not visible');

        NightwatchAssertion.create = createOrig;
        done();
      } catch (err) {
        done(err);
      }
    });

    this.client.start();
  });

  it('client.waitForElementVisible() fail with global timeout default and custom message', function (done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return {
        run: function() {
          return Promise.resolve();
        }
      };
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

    this.client.api.globals.waitForConditionTimeout = 15;
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementVisible('#weblogin', function callback(result, instance) {
      try {
        assert.strictEqual(assertion[3], 'Test message <#weblogin> and a global 15 ms.');

        NightwatchAssertion.create = createOrig;
        done();
      } catch (err) {
        done(err);
      }
    }, 'Test message <%s> and a global %s ms.');

    this.client.start();
  });

  it('client.waitForElementVisible() StaleElementReference error', function (done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return {
        run: function() {
          return Promise.resolve();
        }
      };
    };

    MockServer
      .addMock({
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

    this.client.api.waitForElementVisible('#stale-element', 110, 10, function callback(result, instance) {
      try {
        assert.strictEqual(assertion[0], true);
        assert.strictEqual(result.value, true);

        NightwatchAssertion.create = createOrig;
      } catch (err) {
        done(err);
      }
    });

    this.client.start(function() {
      MockServer.removeMock({
        url: '/wd/hub/session/1352110219202/elements',
        method: 'POST'
      });
      done();
    });
  });

  it('client.waitForElementVisible() with element not found', function (done) {
    const assertion = [];
    let result;

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return {
        run: function() {
          return Promise.resolve();
        }
      };
    };

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 5;
    this.client.api.waitForElementVisible('.weblogin', 11, function (res, instance) {
      result = res;
    });

    this.client.start(function(e) {
      try {
        assert.strictEqual(result.value, false);
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.err.value, null);
        assert.strictEqual(assertion[0], false);
        assert.deepStrictEqual(assertion[1], { actual: 'not found', expected: 'visible' });

        NightwatchAssertion.create = createOrig;
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('client.waitForElementVisible() success after retry', function (done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return {
        run: function() {
          return Promise.resolve();
        }
      };
    };

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    }, true);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    }, true);

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 50;
    this.client.api.waitForElementVisible('#weblogin', 110, function (result, instance) {
      assert.strictEqual(assertion[0], true);
      NightwatchAssertion.create = createOrig;
    });

    this.client.start(done);
  });

  it('client.waitForElementVisible() fail with no args and global timeout not set', function () {
    this.client.api.globals.waitForConditionTimeout = null;

    this.client.api.waitForElementVisible('foo');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('waitForElement expects second parameter to have a global default (waitForConditionTimeout) to be specified if not passed as the second parameter'));
    });
  });
});
