const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.textMatches', function () {
  const assertionName = 'textMatches';
  const api = 'getText';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('textMatches assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'text', 'Test message'],
      assertMessage: true,
      assertArgs: true,
      assertResult: true,
      commandResult: {
        value: 'expected text result'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'expected text result');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('textMatches assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'text'],
      commandResult: {
        value: 'random value'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'random value');
        assert.strictEqual(instance.expected(), 'matches \'text\'');
        assert.strictEqual(instance.getValue(), 'random value');
        assert.strictEqual(failure, 'Expected "matches \'text\'" but got: "random value"');
        assert.strictEqual(err.message, `Testing if the text matches <.test_element> 'text' in 5ms - expected "matches 'text'" but got: "random value" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.textMatches assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'text', 'Test message'],
      commandResult: {
        value: 'random value'
      },
      assertResult: true,
      assertMessage: true,
      assertArgs: true,
      negate: true,
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'random value');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('textMatches assertion - element not found', function() {
    return assertionTest({
      args: ['.test_element', 'text'],
      commandResult: {
        value: [],
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'matches \'text\'');
        assert.strictEqual(failure, 'Expected "matches \'text\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Testing if the text matches <.test_element> 'text' in 5ms - expected "matches 'text'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.textMatches assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'text'],
      commandResult: {
        value: 'expected text result'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({instance, failure}) {
        assert.strictEqual(failure, 'Expected "does not matches \'text\'" but got: "expected text result"');
        assert.strictEqual(instance.getActual(), 'expected text result');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
