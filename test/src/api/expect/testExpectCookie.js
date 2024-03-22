const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const {strictEqual, deepStrictEqual} = assert;

describe('expect.cookie', function () {
  describe('with backwards compat mode', function () {
    beforeEach(function (done) {
      ExpectGlobals.beforeEach.call(this, {
        backwards_compatibility_mode: true,
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

    it('to contain [PASSED]', function () {
      Nocks.cookie('cookie-name', 'cookie-value');
      let expect = this.client.api.expect.cookie('cookie-name').to.contain('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to contain: "cookie-value"'), expect.assertion.message);
      });
    });

    it('contains [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');

      let expect = this.client.api.expect.cookie('cookie-name').contains('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 40);
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to contain: "cookie-value"'));
      });
    });
  });

  describe('without compat mode', function () {
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

    it('to contain [PASSED]', function () {
      Nocks.cookie('cookie-name', 'cookie-value');
      let expect = this.client.api.expect.cookie('cookie-name').to.contain('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to contain: "cookie-value"'), expect.assertion.message);
      });
    });

    it('contains [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');

      let expect = this.client.api.expect.cookie('cookie-name').contains('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 40);
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to contain: "cookie-value"'));
      });
    });

    it('toContain [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').toContain('cookie-value');

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.strictEqual(err, undefined);
      });
    });

    it('toContain [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;
      this.client.api.globals.abortOnAssertionFailure = true;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').toContain('other-value');

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.ok(err instanceof Error);
        assert.ok(/^Expected cookie "cookie-name" to contain: "other-value" - expected "contain 'other-value'" but got: "cookie-value" \(\d+ms\)/.test(err.message), err.message);
      });
    });


    it('toEqual [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').toEqual('cookie-value');

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.strictEqual(err, undefined);
      });
    });

    it('toEqual [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;
      this.client.api.globals.abortOnAssertionFailure = true;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').toEqual('other-value');

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.ok(err instanceof Error);
        assert.ok(/^Expected cookie "cookie-name" to equal: "other-value" - expected "equal 'other-value'" but got: "cookie-value" \(\d+ms\)/.test(err.message), err.message);
      });
    });

    it('toMatch [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').toMatch(/cookie-value/);

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.strictEqual(err, undefined);
      });
    });

    it('toMatch no regex [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');
      let error;

      try {
        this.client.api.expect.cookie('cookie-name').toMatch('');
      } catch (err) {
        error = err;
      }

      assert.ok(error instanceof Error);
    });

    it('toMatch [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;
      this.client.api.globals.abortOnAssertionFailure = true;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').toMatch(/other-value/);

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.ok(err instanceof Error);
        assert.ok(/^Expected cookie "cookie-name" to match: "\/other-value\/" - expected "match '\/other-value\/'" but got: "cookie-value" \(\d+ms\)/.test(err.message), err.message);
      });
    });

    it('not.toEqual [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').not.toEqual('other');

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.strictEqual(err, undefined);
      });
    });

    it('not.toEqual [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;
      this.client.api.globals.abortOnAssertionFailure = true;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');

      const api = this.client.api.expect.cookie('cookie-name').not.toEqual('cookie-value');

      return this.client.start(function (err) {
        assert.ok('capabilities' in api);
        assert.ok(err instanceof Error);
        assert.ok(/^Expected cookie "cookie-name" to not equal: "cookie-value" - expected "not equal 'cookie-value'" but got: "cookie-value" \(\d+ms\)/.test(err.message), err.message);
      });
    });

    it('to equal to [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');

      let expect = this.client.api.expect.cookie('cookie-name').to.equal('other-cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'equal \'other-cookie-value\'');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.actual, 'cookie-value');
        strictEqual(expect.assertion.resultValue, 'cookie-value');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.messageParts[0], ' equal: "other-cookie-value"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to equal: "other-cookie-value"'));
      });
    });

    it('to NOT equal to [PASSED]', function () {
      Nocks.cookie('cookie-name', 'cookie-value');

      let expect = this.client.api.expect.cookie('cookie-name').to.not.equal('xx');

      return this.client.start(function () {
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.resultValue, 'cookie-value');
        strictEqual(expect.assertion.messageParts[0], ' not equal: "xx"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to not equal: "xx"'));
      });
    });

    it('to NOT equal to [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');

      let expect = this.client.api.expect.cookie('cookie-name').to.not.equal('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'cookie-value');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.messageParts[0], ' not equal: "cookie-value"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to not equal: "cookie-value"'),
          `Message was: ${expect.assertion.message}`);
      });
    });

    it('to equal waitFor [PASSED]', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'cookie-value');

      let expect = this.client.api.expect.cookie('cookie-name').to.equal('cookie-value').before(110);
      Nocks.cookie('cookie-name', 'cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 110);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.retries, 1);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to equal: "cookie-value" in 110ms (' + expect.assertion.elapsedTime + 'ms)'));
      });
    });

    it('to equal and waitFor [FAILED] - value not equal', function () {
      this.client.api.globals.waitForConditionTimeout = 10;
      this.client.api.globals.waitForConditionPollInterval = 250;

      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name').to.equal('cookie-value').before(250);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 250);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        strictEqual(expect.assertion.message, `Expected cookie "cookie-name" to equal: "cookie-value" in 250ms - expected "equal 'cookie-value'" but got: "other" (${expect.assertion.elapsedTime}ms)`);
      });
    });


    it('to not contains [PASSED]', function () {
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name').to.not.contains('vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not contain \'vasq\'');
        strictEqual(expect.assertion.actual, 'other');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'other');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' not contain: "vasq"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to not contain: "vasq"'));
      });
    });


    it('with domain to contain [PASSED]', function () {
      Nocks.cookie('cookie-name', 'cookie-value');
      let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').to.contain('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" for domain "cookie-domain" to contain: "cookie-value"'),
          `Message: ${expect.assertion.message}`);
      });
    });

    it('with domain to equal - cookie not found [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks
        .cookieNotFound()
        .cookieNotFound()
        .cookieNotFound();
      let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').to.equal('other-cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" for domain "cookie-domain" to equal: "other-cookie-value" - no cookie "cookie-name" for domain "cookie-domain" was found - expected "equal \'other-cookie-value\'" but got: "[NotFoundError]"'), expect.assertion.message);
      });
    });

    it('with domain to contain [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').to.contain('other-cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" for domain "cookie-domain" to contain: "other-cookie-value"'));
      });
    });

    it('with domain to NOT contain [PASSED]', function () {
      Nocks.cookie('cookie-name', 'cookie-value');
      let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').not.to.contain('other-cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" for domain "cookie-domain" to not contain: "other-cookie-value"'), expect.assertion.message);
      });
    });

    it('with domain to NOT contain [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('cookie-name', 'cookie-value');
      Nocks.cookie('cookie-name', 'cookie-value');
      let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').not.to.contain('cookie-value');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" for domain "cookie-domain" to not contain: "cookie-value"'), expect.assertion.message);
      });
    });


    it('to not contain [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name').to.not.contains('other');

      return this.client.start(function () {
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'other');
        strictEqual(expect.assertion.passed, false);
        assert.deepStrictEqual(expect.assertion.messageParts[0], ' not contain: "other"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to not contain: "other"'));
      });
    });

    it('to not match [PASSED]', function () {
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name').to.not.match(/vasq/);

      return this.client.start(function () {
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to'));
        strictEqual(expect.assertion.expected, 'not match \'/vasq/\'');
        strictEqual(expect.assertion.actual, 'other');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'other');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' not match: "/vasq/"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to not match: "/vasq/"'));
      });
    });

    it('to not match [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name').to.not.match(/other/);

      return this.client.start(function () {
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to'));
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'other');
        strictEqual(expect.assertion.passed, false);
        assert.deepStrictEqual(expect.assertion.messageParts[0], ' not match: "/other/"');
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to not match: "/other/"'));
      });
    });

    it('to equal to - cookie not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('', 'other');
      Nocks.cookie('', 'other');
      let expect = this.client.api.expect.cookie('cookie-name').to.equal('vasq');

      return this.client.start(function () {
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to equal: "vasq" - no cookie "cookie-name" was found'), expect.assertion.message);
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.resultValue, undefined);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.messageParts.includes(' equal: "vasq"'));
        assert.ok(expect.assertion.messageParts.includes(' - no cookie "cookie-name" was found'));
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to equal: "vasq" - no cookie "cookie-name" was found'));
      });
    });

    it('to equal with waitFor - cookie found on retry', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.cookie('', 'other');
      Nocks.cookie('cookie-name', 'hp vasq');

      let expect = this.client.api.expect.cookie('cookie-name').to.equal('hp vasq').before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to equal: "hp vasq" in 60ms (' + expect.assertion.elapsedTime + 'ms)'));
      });
    });

    it('to match - throws exception on invalid regex', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name');
      assert.throws(function () {
        expect.matches('');
      }.bind(this));

      return this.client.start();
    });

    it('to equal and waitFor [FAILED] - value not found', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');
      Nocks.cookie('cookie-name', 'other');

      let expect = this.client.api.expect.cookie('cookie-name').to.equal('hp vasq').before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        assert.ok(expect.assertion.message.startsWith('Expected cookie "cookie-name" to equal: "hp vasq" in 60ms'));
      });
    });
  });
});
