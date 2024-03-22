const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.present', function() {

  describe('with backwards compat mode', function() {
    beforeEach(function(done) {
      ExpectGlobals.beforeEach.call(this, {
        output: false,
        silent: false,
        backwards_compatibility_mode: true
      }, () => {
        this.client.api.globals.abortOnAssertionFailure = false;
        done();
      });
    });

    afterEach(function(done) {
      Nocks.cleanAll();
      ExpectGlobals.afterEach.call(this, done);
    });

    it('to be present with waitFor [PASSED]', function() {
      Nocks.elementFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present.before(100);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 100);
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 100ms (' + expect.assertion.elapsedTime + 'ms)'));
      });
    });

    it('to be present with waitFor [FAILED]', function() {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present.before(60);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 60);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 60ms - element was not found'));
      });
    });
  });

  describe('without compat mode', function() {
    beforeEach(function(done) {
      ExpectGlobals.beforeEach.call(this, {
        output: false,
        silent: false
      }, () => {
        this.client.api.globals.abortOnAssertionFailure = false;
        done();
      });
    });

    afterEach(function(done) {
      Nocks.cleanAll();
      ExpectGlobals.afterEach.call(this, done);
    });

    it('to be present [PASSED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .elementFound()
        .elementFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present;

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.selector, '#weblogin');
        assert.strictEqual(expect.assertion.negate, false);
        assert.strictEqual(expect.assertion.waitForMs, 40);
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(/^Expected element <#weblogin> to be present \(\d+ms\)$/.test(expect.assertion.message), expect.assertion.message);
        assert.strictEqual(expect.assertion.messageParts.length, 1);
      });
    });

    it('to be present with waitFor [PASSED]', function() {
      Nocks.elementFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present.before(100);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 100);
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 100ms (' + expect.assertion.elapsedTime + 'ms)'));
      });
    });

    it('to be present with waitFor [FAILED]', function() {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present.before(60);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 60);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 60ms - element was not found'));
      });
    });

    it('to be present [FAILED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present;

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.selector, '#weblogin');
        assert.strictEqual(expect.assertion.negate, false);
        assert.strictEqual(expect.assertion.waitForMs, 40);
        assert.strictEqual(expect.assertion.passed, false);
        assert.strictEqual(expect.assertion.expected, 'present');
        assert.strictEqual(expect.assertion.actual, 'not present');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present - element was not found'));
        assert.strictEqual(expect.assertion.messageParts[0], ' - element was not found');
      });
    });

    it('to be present with waitFor [PASSED on retry]', function() {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementNotFound().elementFound();

      let expect = this.client.api.expect.element('#weblogin').to.be.present.before(60);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 60);
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 60ms (' + expect.assertion.elapsedTime + 'ms)'));
      });
    });

    it('to not be present [PASSED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.not.be.present;

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.selector, '#weblogin');
        assert.strictEqual(expect.assertion.negate, true);
        assert.strictEqual(expect.assertion.passed, true);
        assert.strictEqual(expect.assertion.expected, 'not present');
        assert.strictEqual(expect.assertion.actual, 'not present');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be present'));
        assert.strictEqual(expect.assertion.messageParts.length, 2);
      });
    });

    it('to not be present [FAILED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .elementFound()
        .elementFound();

      let expect = this.client.api.expect.element('#weblogin').to.not.be.present;

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.selector, '#weblogin');
        assert.strictEqual(expect.assertion.negate, true);
        assert.strictEqual(expect.assertion.passed, false);
        assert.strictEqual(expect.assertion.expected, 'not present');
        assert.strictEqual(expect.assertion.actual, 'present');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be present'));
        assert.strictEqual(expect.assertion.messageParts.length, 2);
      });
    });

    it('to be present - xpath via useXpath [PASSED]', function() {
      Nocks.elementFoundXpath();

      this.client.api.useXpath();
      let expect = this.client.api.expect.element('//weblogin').to.be.present;

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.selector, '//weblogin');
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be present'));
      });
    });

    it('to be present - xpath via argument [PASSED]', function() {
      Nocks.elementFoundXpath();

      let expect = this.client.api.expect.element('//weblogin', 'xpath').to.be.present;

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.selector, '//weblogin');
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be present'));
      });
    });
  });
});
