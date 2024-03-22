const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.domPropertyMatches', function () {
  const assertionName = 'domPropertyMatches';
  const api = 'getElementProperty';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('domPropertyMatches assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'tagName', 'test', 'Test message'],
      assertMessage: true,
      assertArgs: true,
      assertResult: true,
      commandResult: {
        value: 'test'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'test');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('domPropertyMatches assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'tagName', 'test'],
      commandResult: {
        value: 'random_tag'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'random_tag');
        assert.strictEqual(instance.expected(), 'matches \'test\'');
        assert.strictEqual(instance.getValue(), 'random_tag');
        assert.strictEqual(failure, 'Expected "matches \'test\'" but got: "random_tag"');
        assert.strictEqual(err.message, `Testing if dom property 'tagName' of element <.test_element> matches 'test' in 5ms - expected "matches 'test'" but got: "random_tag" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.domPropertyMatches assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'tagName', 'test', 'Test message'],
      commandResult: {
        value: 'random_tag'
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
        assert.strictEqual(instance.getActual(), 'random_tag');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('.not.domPropertyMatches assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'tagName', 'test'],
      commandResult: {
        value: 'test'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({instance, failure}) {
        assert.strictEqual(failure, 'Expected "does not matches \'test\'" but got: "test"');
        assert.strictEqual(instance.getActual(), 'test');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
