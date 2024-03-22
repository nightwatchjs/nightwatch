const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributeEquals', function () {
  const assertionName = 'attributeEquals';
  const api = 'getAttribute';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('attributeEquals assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'role', 'main', 'Test message'],
      commandResult: {
        value: 'main'
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

  it('not.attributeEquals assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'role', 'main'],
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
        assert.strictEqual(instance.message, 'Testing if attribute \'role\' of element <.test_element> doesn\'t equal \'main\'');
        assert.ok(message.startsWith('Testing if attribute \'role\' of element <.test_element> doesn\'t equal \'main\''), message);
      }
    });
  });

  it('not.attributeEquals assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'role', 'main'],
      commandResult: {
        value: 'main'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'main');
        assert.strictEqual(instance.getActual(), 'main');
        assert.strictEqual(err.message, `Testing if attribute 'role' of element <.test_element> doesn't equal 'main' in 5ms - expected "not equals 'main'" but got: "main" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributeEquals assertion passed with selector object', function() {
    return assertionTest({
      args: [{selector: '.test_element'}, 'role', 'main'],
      commandResult: {
        value: 'main'
      },
      assertArgs: true,
      assertResult: true,
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'main');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if attribute \'role\' of element <.test_element> equals \'main\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('attributeEquals assertion failed', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'main', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not_expected');
        assert.strictEqual(failure, 'Expected "equals \'main\'" but got: "not_expected"');
      }
    });
  });

  it('attributeEquals assertion - element not found', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'main', 'Test attribute %s from element "%s" == %s'],
      commandResult: {
        status: -1,
        value: []
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'equals \'main\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "equals \'main\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test attribute 'role' from element "<.test_element>" == 'main' in 5ms - expected "equals 'main'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributeEquals assertion - attribute not found', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'main'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if attribute 'role' of element <.test_element> equals 'main' in 5ms - expected "equals 'main'" but got: "Element does not have a 'role' attribute" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a \'role\' attribute');
      }
    });
  });
});
