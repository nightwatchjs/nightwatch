const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributeMatches', function () {
  const assertionName = 'attributeMatches';
  const api = 'getAttribute';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('attributeMatches assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test', '(button)', 'Test message'],
      assertMessage: true,
      assertArgs: true,
      assertResult: true,
      commandResult: {
        value: 'cta-button'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'cta-button');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('attributeMatches assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test', '(button)'],
      commandResult: {
        value: 'random value'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'random value');
        assert.strictEqual(instance.expected(), 'matches \'(button)\'');
        assert.strictEqual(instance.getValue(), 'random value');
        assert.strictEqual(failure, 'Expected "matches \'(button)\'" but got: "random value"');
        assert.strictEqual(err.message, `Testing if attribute 'data-test' of element <.test_element> matches '(button)' in 5ms - expected "matches '(button)'" but got: "random value" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.attributeMatches assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test', '(button)', 'Test message'],
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
        assert.strictEqual(instance.message, 'Test message');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('.not.attributeMatches assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'data-test', '(button)'],
      commandResult: {
        value: 'test-button'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({instance, failure}) {
        assert.strictEqual(failure, 'Expected "does not matches \'(button)\'" but got: "test-button"');
        assert.strictEqual(instance.getActual(), 'test-button');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
