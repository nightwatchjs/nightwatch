const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.containsText', function () {
  const assertionName = 'containsText';
  const api = 'getText';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('containsText assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'expected text result'
      },
      assertArgs: true,
      assertMessage: true,
      assertion({reporter, instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getValue(), 'expected text result');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('not.containsText assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'other text'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other text');
        assert.strictEqual(instance.getActual(), 'does not contain \'text result\'');
        assert.strictEqual(instance.message, 'Test message');
      }
    });
  });

  it('not.containsText assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'expected text result'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'expected text result');
        assert.strictEqual(instance.getActual(), 'contains \'text result\'');
        assert.strictEqual(err.message, `Test message in 5ms - expected "does not contain text 'text result'" but got: "contains 'text result'" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('containsText assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}, 'text result'],
      commandResult: {
        value: 'expected text result'
      },
      assertArgs: true,
      assertResult: true,
      assertion({instance, failure, message, err}) {
        assert.ok(message.startsWith('Testing if element <.test_element> contains text \'text result\''), message);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'contains \'text result\'');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> contains text \'text result\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('containsText assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'does not contain \'text result\'');
        assert.strictEqual(failure, 'Expected "contains text \'text result\'" but got: "does not contain \'text result\'"');
      }
    });
  });

  it('containsText assertion - element not found', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'contains text \'text result\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "contains text \'text result\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test message in 5ms - expected "contains text 'text result'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });
});

