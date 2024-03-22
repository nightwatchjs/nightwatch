const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const {strictEqual} = assert;

describe('expect.value', function () {
  describe('with backwards compat mode', function () {
    beforeEach(function (done) {
      ExpectGlobals.beforeEach.call(this, {
        output: false,
        silent: false,
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

    it('to have value equal to [PASSED]', function () {
      Nocks.elementFound().value('hp vasq');
      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq"'));
      });
    });

    it('to have value equal to [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('hp vasq')
        .value('hp vasq')
        .value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'equal to \'vasq\'');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.actual, 'hp vasq');
        strictEqual(expect.assertion.resultValue, 'hp vasq');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.messageParts[0], ' equal to: "vasq"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "vasq"'));
      });
    });

    it('to have value equals [FAILED] - value attribute not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value(null)
        .value(null)
        .value(null);

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('xx');
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'equal to \'xx\'');
        strictEqual(expect.assertion.actual, null);
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to have value equal to: "xx" - value attribute was not found - expected "equal to 'xx'" but got: "null" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('value toEqual - stale element error', function () {
      this.client.api.globals.waitForConditionTimeout = 250;
      this.client.api.globals.waitForConditionPollInterval = 100;

      Nocks
        .elementFound()
        .elementStateError({
          error: 'stale element reference',
          url: '/wd/hub/session/1352110219202/element/0/property/value',
          method: 'get'
        })
        .elementNotFound()
        .elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').value.equal('xx');

      return this.client.start(function () {
        strictEqual(expect.assertion.selector, '#weblogin');
        strictEqual(expect.assertion.negate, false);
        assert.ok(expect.assertion.retries >= 2, expect.assertion.retries + ' retries.');
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.actual, 'not present');
        strictEqual(expect.assertion.passed, false);
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

    it('to have value equal to [PASSED]', function () {
      Nocks.elementFound().value('hp vasq');
      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq"'));
      });
    });

    it('to have value which equals [PASSED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('hp vasq')
        .value('hp vasq')
        .value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.which.equals('hp vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 40);
        strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which equals: "hp vasq"'));
      });
    });

    it('to have value equal to [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('hp vasq')
        .value('hp vasq')
        .value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'equal to \'vasq\'');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.actual, 'hp vasq');
        strictEqual(expect.assertion.resultValue, 'hp vasq');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.messageParts[0], ' equal to: "vasq"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "vasq"'));
      });
    });

    it('to have value NOT equal to [PASSED]', function () {
      Nocks.elementFound().value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');

      return this.client.start(function () {
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.resultValue, 'hp vasq');
        strictEqual(expect.assertion.messageParts[0], ' not equal to: "xx"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not equal to: "xx"'));
      });
    });

    it('to have value NOT equal to [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('hp vasq')
        .value('hp vasq')
        .value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('hp vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not equal to \'hp vasq\'');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.actual, 'hp vasq');
        strictEqual(expect.assertion.resultValue, 'hp vasq');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to have value not equal to: "hp vasq" - expected "not equal to 'hp vasq'" but got: "hp vasq" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to have value equal with waitFor [PASSED]', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks
        .elementFound()
        .value(null)
        .value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 110);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.retries, 1);
        strictEqual(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms (' + expect.assertion.elapsedTime + 'ms)');
      });
    });

    it('to have value equal and waitFor [FAILED] - value not equal', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().value('xx', 3);

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 110);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        assert.ok(expect.assertion.elapsedTime >= 110);
        strictEqual(expect.assertion.expected, 'equal to \'hp vasq\'');
        //strictEqual(expect.assertion.actual, 'xx');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms'));
      });
    });

    it('to have value not equal to [PASSED]', function () {
      Nocks.elementFound().value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('vasq');
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not equal to \'vasq\'');
        strictEqual(expect.assertion.actual, 'xx');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'xx');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' not equal to: "vasq"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not equal to: "vasq"'));
      });
    });

    it('to have value not equal to [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('xx')
        .value('xx')
        .value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not equal to \'xx\'');
        strictEqual(expect.assertion.actual, 'xx');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'xx');
        strictEqual(expect.assertion.passed, false);
      });
    });

    it('to have value not contains [PASSED]', function () {
      Nocks.elementFound().value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('vasq');

      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not contain \'vasq\'');
        strictEqual(expect.assertion.actual, 'xx');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'xx');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' not contain: "vasq"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not contain: "vasq"'));
      });
    });

    it('to have value contains [PASSED]', function () {
      Nocks.elementFound().value('vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'contains \'vasq\'');
        strictEqual(expect.assertion.actual, 'vasq');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.resultValue, 'vasq');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' which ');
        strictEqual(expect.assertion.messageParts[1], 'contains: "vasq"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which contains: "vasq"'));
      });
    });

    it('to have value not contains [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('xx')
        .value('xx')
        .value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('xx');
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not contain \'xx\'');
        strictEqual(expect.assertion.actual, 'xx');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'xx');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to have value not contain: "xx" - expected "not contain 'xx'" but got: "xx" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to have value equals [FAILED] - value attribute not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value(null)
        .value(null)
        .value(null);

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('xx');
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'equal to \'xx\'');
        strictEqual(expect.assertion.actual, null);
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to have value equal to: "xx" - value attribute was not found - expected "equal to 'xx'" but got: "null" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to have value not match [PASSED]', function () {
      Nocks.elementFound().value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/vasq/);

      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not match \'/vasq/\'');
        strictEqual(expect.assertion.actual, 'xx');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'xx');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' not match: "/vasq/"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not match: "/vasq/"'));
      });
    });

    it('to have value which matches [PASSED]', function () {
      Nocks.elementFound().value('vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq/);

      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'matches \'/vasq/\'');
        strictEqual(expect.assertion.actual, 'vasq');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.resultValue, 'vasq');
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.messageParts[0], ' which ');
        strictEqual(expect.assertion.messageParts[1], 'matches: "/vasq/"');
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which matches: "/vasq/"'));
      });
    });

    it('to have value not match [FAILED]', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('xx')
        .value('xx')
        .value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/xx/);
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'not match \'/xx/\'');
        strictEqual(expect.assertion.actual, 'xx');
        strictEqual(expect.assertion.negate, true);
        strictEqual(expect.assertion.resultValue, 'xx');
        strictEqual(expect.assertion.passed, false);
      });
    });

    it('to have value equal to - element not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementNotFound()
        .elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
      assert.ok(expect.assertion.message.startsWith('Expected element %s to have value'));

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'equal to \'vasq\'');
        strictEqual(expect.assertion.actual, 'not present');
        strictEqual(expect.assertion.negate, false);
        strictEqual(expect.assertion.resultValue, null);
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to have value equal to: "vasq" - element was not found - expected "equal to 'vasq'" but got: "not present" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to have value which contains - element not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementNotFound()
        .elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'contains \'vasq\'');
        strictEqual(expect.assertion.actual, 'not present');
        strictEqual(expect.assertion.passed, false);
      });
    });

    it('to have value match - element not found', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks
        .elementNotFound()
        .elementNotFound()
        .elementNotFound()
        .elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq$/);

      return this.client.start(function () {
        strictEqual(expect.assertion.expected, 'matches \'/vasq$/\'');
        strictEqual(expect.assertion.actual, 'not present');
        strictEqual(expect.assertion.passed, false);
        strictEqual(expect.assertion.message, `Expected element <#weblogin> to have value which matches: "/vasq$/" - element was not found - expected "matches '/vasq$/'" but got: "not present" (${expect.assertion.elapsedTime}ms)`);
      });
    });

    it('to have value equal to with waitFor - element not found', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(60);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 60);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 60ms - element was not found'));
      });
    });

    it('to have value equal with waitFor - element found on retry', function () {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementNotFound().elementFound().value('hp vasq');

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 110);
        strictEqual(expect.assertion.passed, true);
        strictEqual(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms (' + expect.assertion.elapsedTime + 'ms)');
      });
    });

    it('to have value match - throws exception on invalid regex', function () {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 20;

      Nocks.elementFound()
        .value('xx')
        .value('xx')
        .value('xx');

      let expect = this.client.api.expect.element('#weblogin').to.have.value;
      assert.throws(function () {
        expect.which.matches('');
      }.bind(this));

      return this.client.start();
    });

    it('to have value equal and waitFor [FAILED] - value not found', function () {
      this.client.api.globals.waitForConditionPollInterval = 100;
      Nocks.elementFound();

      let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(250);

      Nocks.elementFound().value('xx', 4);

      return this.client.start(function () {
        strictEqual(expect.assertion.waitForMs, 250);
        strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries > 1);
        assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 250ms'));
      });
    });
  });
});
