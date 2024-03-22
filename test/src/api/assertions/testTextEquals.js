const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.textEquals', function () {
  const assertionName = 'textEquals';
  const api = 'getText';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('textEquals assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'text result'
      },
      assertArgs: true,
      assertMessage: true,
      assertion({reporter, instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getValue(), 'text result');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('not.textEquals assertion passed', function () {
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
        assert.strictEqual(instance.getActual(), 'other text');
        assert.strictEqual(instance.message, 'Test message');
      }
    });
  });

  it('not.textEquals assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'text result'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'text result');
        assert.strictEqual(instance.getActual(), 'text result');
        assert.strictEqual(err.message, `Test message in 5ms - expected "doesn't equal 'text result'" but got: "text result" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('textEquals assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}, 'text result'],
      commandResult: {
        value: 'text result'
      },
      assertArgs: true,
      assertResult: true,
      assertion({instance, failure, message, err}) {
        assert.ok(message.startsWith('Testing if element\'s <.test_element> inner text equals \'text result\''), message);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'text result');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element\'s <.test_element> inner text equals \'text result\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('textEquals assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'text result', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not_expected');
        assert.strictEqual(failure, 'Expected "equals \'text result\'" but got: "not_expected"');
      }
    });
  });

  it('textEquals assertion - element not found', function () {
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
        assert.strictEqual(instance.expected(), 'equals \'text result\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "equals \'text result\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test message in 5ms - expected "equals 'text result'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });
});

