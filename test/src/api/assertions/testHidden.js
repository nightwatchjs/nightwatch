const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.hidden', function () {
  const assertionName = 'hidden';
  const api = 'isVisible';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('hidden assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'Test message'],
      assertMessage: true,
      assertArgs: true,
      commandResult: {
        status: 0,
        value: false
      },
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('hidden assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}],
      commandResult: {
        status: 0,
        value: false
      },
      assertArgs: true,
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.strictEqual(instance.getActual(), true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element \'<.test_element>\' is hidden'), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('hidden assertion failed', function () {
    return assertionTest({
      args: ['.test_element'],
      assertArgs: true,
      assertResult: true,
      commandResult: {
        status: 0,
        value: true
      },
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), false);
        assert.strictEqual(failure, 'Expected "true" but got: "false"');
      }
    });
  });

  it('hidden assertion - element not found', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), '');
        assert.strictEqual(instance.expected, true);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "true" but got: ""');
      }
    });
  });
});
