const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.value', function () {
  const assertionName = 'value';
  const api = 'getValue';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('value assertion passed', function() {
    return assertionTest({
      args: ['.test_element', 'some-value', 'Test message'],
      commandResult: {
        status: 0,
        value: 'some-value'
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

  it('not.value assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult: {
        value: 'second'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'second');
        assert.strictEqual(instance.getActual(), 'second');
        assert.strictEqual(instance.message, 'Testing if value of element <.test_element> doesn\'t equal \'some-value\'');
        assert.ok(message.startsWith('Testing if value of element <.test_element> doesn\'t equal \'some-value\''), message);
      }
    });
  });

  it('not.value assertion failed', function () {
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
        assert.strictEqual(err.message, `Testing if value of element <.test_element> doesn't equal 'some-value' in 5ms - expected "not equals 'some-value'" but got: "some-value" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('value assertion passed with selector object', function() {
    return assertionTest({
      args: [{selector: '.test_element'}, 'some-value'],
      commandResult: {
        status: 0,
        value: 'some-value'
      },
      assertArgs: true,
      assertion({reporter, instance, failure, err, message}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'some-value');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if value of element <.test_element> equals \'some-value\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('value assertion failed', function() {
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
        assert.strictEqual(failure, 'Expected "equals \'some-value\'" but got: "wrong-value"');
      }
    });
  });

  it('value assertion - element not found', function() {
    return assertionTest({
      args: ['.test_element', 'some-value', 'Test value of element %s == %s'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'equals \'some-value\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "equals \'some-value\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test value of element <.test_element> == 'some-value' in 5ms - expected "equals 'some-value'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributeEquals assertion - value attribute not found', function() {
    return assertionTest({
      args: ['.test_element', 'some-value'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if value of element <.test_element> equals 'some-value' in 5ms - expected "equals 'some-value'" but got: "Element does not have a value attribute" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a value attribute');
      }
    });
  });
});

