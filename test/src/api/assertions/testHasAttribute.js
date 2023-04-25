const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.hasAttribute', function () {
  const assertionName = 'hasAttribute';
  const api = 'getAttribute';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('hasAttribute assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test', 'Test message'],
      commandResult: {
        value: 'data-track'
      },
      assertMessage: true,
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('not.hasAttribute assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test'],
      commandResult: {
        value: 'data-track'
      },
      negate: true,
      assertion({instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.deepStrictEqual(instance.getValue(), 'data-track');
        assert.deepStrictEqual(instance.getActual(), 'data-track');
        assert.strictEqual(instance.message, 'Testing if element <.test_element> doesn\'t have attribute \'data-test\'');
        assert.ok(message.startsWith('Testing if element <.test_element> doesn\'t have attribute \'data-test\''), message);
      }
    });
  });

  it('not.hasAttribute assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test'],
      commandResult: {
        value: 'data-test'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.deepStrictEqual(instance.getValue(), 'data-test');
        assert.deepStrictEqual(instance.getActual(), 'data-test');
        assert.strictEqual(err.message, `Testing if element <.test_element> doesn't have attribute 'data-test' in 5ms - expected "has not data-test" but got: "data-test" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('hasAttribute assertion passed with selector object', function() {
    return assertionTest({
      args: [{selector: '.test_element'}, 'data-test'],
      commandResult: {
        value: 'data-test'
      },
      assertResult: true,
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.deepStrictEqual(instance.getActual(), 'data-test');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> has attribute \'data-test\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('hasAttribute assertion failed', function() {
    return assertionTest({
      args: ['.test_element', 'data-test', 'Test message'],
      commandResult: {
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.getActual(), null);
        assert.strictEqual(failure, 'Expected "has data-test" but got: "null"');
      }
    });
  });

  it('hasAttribute assertion - attribute not found', function() {
    return assertionTest({
      args: ['.test_element', 'data-test'],
      commandResult: {
        status: 0,
        value: ''
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if element <.test_element> has attribute 'data-test' in 5ms - expected "has data-test" but got: "" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), '');
        assert.strictEqual(instance.getActual(), '');
      }
    });
  });

  it('hasAttribute assertion failed for wrong parameters', function () {
    return assertionTest({
      args: ['.test_element', ['data-test', 'dummy'], 'Test message'],
      commandResult: {
        value: 'data-track'
      },
      assertMessage: true
    }).catch((err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Error while running "assert.hasAttribute" command: Expected attribute must be a string');
    });
  });
});
