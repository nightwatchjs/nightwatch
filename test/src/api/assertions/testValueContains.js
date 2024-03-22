const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.valueContains', function () {
  const assertionName = 'valueContains';
  const api = 'getValue';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('valueContains assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'some-value', 'Test message'],
      commandResult: {
        status: 0,
        value: 'contains-some-value'
      },
      assertMessage: true,
      assertArgs: true,
      assertion({reporter, instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('not.valueContains assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult: {
        status: 0,
        value: 'contains-other-value'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'contains-other-value');
        assert.strictEqual(instance.getActual(), 'contains-other-value');
        assert.strictEqual(instance.message, 'Testing if value of element <.test_element> doesn\'t contain \'some-value\'');
        assert.ok(message.startsWith('Testing if value of element <.test_element> doesn\'t contain \'some-value\''), message);
      }
    });
  });

  it('not.valueContains assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult: {
        value: 'some-value'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'some-value');
        assert.strictEqual(instance.getActual(), 'some-value');
        assert.strictEqual(err.message, `Testing if value of element <.test_element> doesn't contain 'some-value' in 5ms - expected "not contains 'some-value'" but got: "some-value" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('valueContains assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}, 'some-value'],
      commandResult: {
        status: 0,
        value: 'contains-some-value'
      },
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'contains-some-value');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if value of element <.test_element> contains \'some-value\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('valueContains assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult: {
        status: 0,
        value: 'wrong-value'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'wrong-value');
        assert.strictEqual(failure, 'Expected "contains \'some-value\'" but got: "wrong-value"');
      }
    });
  });

  it('valueContains assertion - element not found', function () {
    return assertionTest({
      args: ['.test_element', 'some-value', 'Test value of element "%s" contains %s'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'contains \'some-value\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "contains \'some-value\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test value of element "<.test_element>" contains 'some-value' in 5ms - expected "contains 'some-value'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('valueContains assertion stale element reference', function () {
    let calls = 0;
    const commandResult = function() {
      if (calls === 0) {
        calls++;

        return {
          state: 'stale element reference',
          status: -1,
          errorStatus: 10
        };
      }

      return {
        status: 0,
        value: 'contains-some-value'
      };
    };

    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult,
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.strictEqual(instance.getActual(), 'contains-some-value');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if value of element <.test_element> contains \'some-value\''));
      }
    });
  });

  it('valueContains assertion - value attribute not found', function () {
    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if value of element <.test_element> contains 'some-value' in 5ms - expected "contains 'some-value'" but got: "Element does not have a value attribute" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a value attribute');
      }
    });
  });
});
