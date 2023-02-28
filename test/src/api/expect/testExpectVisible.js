const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const {strictEqual} = assert;

describe('expect.visible', function () {
  describe('with backwards compat mode', function () {
    beforeEach(function (done) {
      ExpectGlobals.beforeEach.call(this, {
        backwards_compatibility_mode: true
      }, () => {
        this.client.api.globals.abortOnAssertionFailure = false;
        done();
      });
    });

    afterEach(function (done) {
      Nocks.cleanAll();
      ExpectGlobals.afterEach.call(this, done);
    });

    it('to be visible [PASSED]', function () {
      Nocks.elementFound().visible();
      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to be visible (${expect.assertion.elapsedTime}ms)`);
        strictEqual(expect.assertion.messageParts.length, 1);
      });
    });

    it('to be visible with waitFor [FAILED]', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().notVisible(3);

      let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 60ms'));
      });
    });
  });

  describe('without backwards compat', function () {
    beforeEach(function (done) {
      ExpectGlobals.beforeEach.call(this, {
        output: false,
        silent: false
      }, () => {
        this.client.api.globals.abortOnAssertionFailure = false;
        done();
      });
    });

    afterEach(function (done) {
      Nocks.cleanAll();
      ExpectGlobals.afterEach.call(this, done);
    });

    const {runExpectAssertion} = ExpectGlobals;

    it('to be visible [PASSED]', function () {
      Nocks.elementFound().visible();
      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to be visible (${expect.assertion.elapsedTime}ms)`);
        strictEqual(expect.assertion.messageParts.length, 1);
      });
    });

    it('to be visible [PASSED] -- appium', function () {
      Nocks.appiumElementFound().appiumElementVisible();

      // Make appium client
      this.client.api.options.selenium.use_appium = true;
      strictEqual(this.client.api.isAppiumClient(), true);

      let expect = this.client.api.expect.element({selector: 'com.app:id/web-login', locateStrategy: 'id'}).to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, 'com.app:id/web-login');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.message, `Expected element <com.app:id/web-login> to be visible (${expect.assertion.elapsedTime}ms)`);
        strictEqual(expect.assertion.messageParts.length, 1);
      });
    });

    it('to be visible with waitFor [PASSED]', function () {
      Nocks.elementFound().visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(100);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 100);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.message, 'Expected element <#weblogin> to be visible in 100ms (' + expect.assertion.elapsedTime + 'ms)');
      });
    });

    it('to be visible with waitFor [FAILED]', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().notVisible(3);

      let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 60ms'));
      });
    });

    it('to be visible [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .notVisible()
        .notVisible()
        .notVisible();

      return runExpectAssertion.call(this, {
        fn: expect => expect.to.be.visible,
        assertion({selector, negate, waitForMs, expected, passed, actual, resultValue, message, messageParts, elapsedTime}) {
          strictEqual(selector, '#weblogin');
          strictEqual(negate, false);
          strictEqual(passed, false);
          strictEqual(waitForMs, 40);
          strictEqual(resultValue, false);
          strictEqual(actual, 'not visible');
          strictEqual(expected, 'visible');
          strictEqual(message, `Expected element <#weblogin> to be visible - expected "visible" but got: "not visible" (${elapsedTime}ms)`);
          strictEqual(messageParts.length, 2, messageParts);
        }
      });
    });

    it('to not be visible [PASSED]', function () {
      Nocks.elementFound().notVisible();

      let expect = this.client.api.expect.element('#weblogin').to.not.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.expected, 'not visible');
        strictEqual(expect.assertion.actual, 'not visible');
        strictEqual(expect.assertion.resultValue, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be visible'));
        strictEqual(expect.assertion.messageParts.length, 1);
      });
    });

    it('to not be visible [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .visible()
        .visible()
        .visible();

      let expect = this.client.api.expect.element('#weblogin').to.not.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.expected, 'not visible');
        strictEqual(expect.assertion.actual, 'visible');
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to not be visible - expected "not visible" but got: "visible" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to be visible - element not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementNotFound()
        .elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.waitForMs, 40);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.expected, 'visible');
        strictEqual(expect.assertion.actual, 'not found');
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to be visible - element was not found - expected "visible" but got: "not found" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to be visible - stale element error followed by success', function () {
      this.client.api.globals.waitForConditionTimeout = 500;
      this.client.api.globals.waitForConditionPollInterval = 100;

      Nocks
        .elementFound()
        .elementStateError({error: 'stale element reference'})
        .elementFound()
        .visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.retries, 1);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.passed, true);
      });
    });

    it('to be visible - generic element error followed by success', function () {
      this.client.api.globals.waitForConditionTimeout = 500;
      this.client.api.globals.waitForConditionPollInterval = 100;

      Nocks
        .elementFound()
        .elementStateError({error: ''})
        .elementFound()
        .visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.retries, 1);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.passed, true);
      });
    });


    it('to be visible - element not interactable error', function () {
      this.client.api.globals.waitForConditionTimeout = 100;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementFound()
        .elementStateError({
          error: 'element not interactable'
        })
        .elementFound()
        .visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.retries, 1);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.passed, true);
      });
    });

    it('to be visible - invalid element state error', function () {
      this.client.api.globals.waitForConditionTimeout = 100;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementFound()
        .elementStateError({
          error: 'invalid element state'
        })
        .elementFound()
        .visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.retries, 1);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.passed, true);
      });
    });

    it('to be visible - element click intercepted error', function () {
      this.client.api.globals.waitForConditionTimeout = 100;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementFound()
        .elementStateError({
          error: 'element click intercepted'
        })
        .elementFound()
        .visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        strictEqual(expect.assertion.retries, 1);
        strictEqual(expect.assertion.resultValue, true);
        strictEqual(expect.assertion.passed, true);
      });
    });

    it('to be visible - session not created error', function () {
      this.client.api.globals.waitForConditionTimeout = 250;
      this.client.api.globals.waitForConditionPollInterval = 100;

      Nocks
        .elementFound()
        .elementStateError({
          error: 'session not created',
          code: 500,
          times: 5
        });

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        assert.ok(expect.assertion.retries >= 2);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.actual, '[SessionNotCreatedError]');
      });
    });

    it('to be visible - unknown error', function () {
      this.client.api.globals.waitForConditionTimeout = 200;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks
        .elementFound()
        .elementStateError({
          error: '',
          code: 400,
          times: 5
        });

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        assert.ok(expect.assertion.retries >= 2);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.actual, 'not visible');
      });
    });

    it('to be visible - invalid json response', function() {
      this.client.api.globals.waitForConditionTimeout = 250;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks
        .elementFound()
        .elementStateError({
          error: '',
          code: 500,
          times: 15,
          reply: '<html></html>'
        });

      let expect = this.client.api.expect.element('#weblogin').to.be.visible;

      return this.client.start(function () {
        assert.ok(expect.assertion.retries >= 2);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.actual, '[WebDriverError]');
      });
    });

    it('to not be visible with waitFor [FAILED]', function () {
      this.client.api.globals.waitForConditionPollInterval = 15;

      Nocks.elementFound().visible().visible();

      let expect = this.client.api.expect.element('#weblogin').to.not.be.visible.before(25);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 25);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be visible in 25ms'));
        strictEqual(expect.assertion.passed, false);
      });
    });

    it('to not be visible with waitFor [PASSED] - element not visible on retry', function () {
      this.client.api.globals.waitForConditionPollInterval = 100;

      Nocks.elementFound().visible().notVisible().notVisible();

      let expect = this.client.api.expect.element('#weblogin').to.not.be.visible.before(130);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 130);
        strictEqual(expect.assertion.message.indexOf('Expected element <#weblogin> to not be visible in 130ms'), 0);
        strictEqual(expect.assertion.passed, true, 'Assertion has passed');
      });
    });

    it('to be visible with waitFor - element not found', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 60ms - element was not found'));
      });
    });

    it('to be visible with waitFor - element found on retry', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementFound().visible();

      let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.message, 'Expected element <#weblogin> to be visible in 60ms (' + expect.assertion.elapsedTime + 'ms)');
      });
    });
  });
});
