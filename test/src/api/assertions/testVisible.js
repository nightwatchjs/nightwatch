const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.visible', function () {
  const assertionName = 'visible';
  const api = 'isVisible';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('visible assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'Test message'],
      commandResult: {
        status: 0,
        value: true
      },
      assertArgs: true,
      assertMessage: true,
      assertion({reporter, instance, failure, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('.not.visible assertion passed', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        status: 0,
        value: false
      },
      negate: true,

      assertion({reporter, instance, queueOpts, err, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), false);
        assert.strictEqual(instance.getActual(), 'not visible');
        assert.strictEqual(instance.message, 'Testing if element <.test_element> is not visible');
        assert.ok(message.startsWith('Testing if element <.test_element> is not visible'), message);
      }
    });
  });

  it('.not.visible assertion failed', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        status: 0,
        value: true
      },
      negate: true,
      assertError: true,

      assertion({reporter, instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), true);
        assert.strictEqual(instance.getActual(), 'visible');
        assert.strictEqual(err.message, `Testing if element <.test_element> is not visible in 5ms - expected "is not visible" but got: "visible" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('visible assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}],
      commandResult: {
        status: 0,
        value: true
      },
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'visible');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> is visible'), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('visible assertion passed with selector object and timeout', function () {
    return assertionTest({
      args: [{selector: '.test_element', timeout: 10, retryInterval: 15}],
      commandResult: {
        status: 0,
        value: true
      },
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'visible');
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.retryAssertionTimeout, 10);
        assert.strictEqual(instance.rescheduleInterval, 15);
        assert.ok(message.startsWith('Testing if element <.test_element> is visible'), message);
        assert.strictEqual(failure, false);
      }
    });
  });
  
  it('visible assertion failed', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        status: 0,
        value: false
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not visible');
        assert.strictEqual(failure, 'Expected "is visible" but got: "not visible"');
      }
    });
  });

  it('visible assertion not - element not found', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'is visible');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "is visible" but got: "element could not be located"');
        assert.strictEqual(err.message, `Testing if element <.test_element> is visible in 5ms - expected "is visible" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });
});

