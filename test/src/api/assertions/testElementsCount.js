const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.elementCounts', function () {
  const assertionName = 'elementsCount';
  const api = 'findElements';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('elementsCount assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 2, 'Test message'],
      commandResult: {
        value: [{'ELEMENT': '0'}, {'ELEMENT': '1'}]
      },
      assertMessage: true,
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.message, 'Test message');
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('not.elementsCount assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 2],
      commandResult: {
        value: [{'ELEMENT': '0'}]
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 1);
        assert.strictEqual(instance.getActual(), 1);
        assert.strictEqual(instance.message, 'Testing if the element count for <.test_element> is not 2');
        assert.ok(message.startsWith('Testing if the element count for <.test_element> is not 2'), message);
      }
    });
  });


  it('elementsCount assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 1],
      commandResult: {
        value: [{'ELEMENT': '0'}, {'ELEMENT': '1'}]
      },
      negate: false,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 2);
        assert.strictEqual(instance.getActual(), 2);
        assert.strictEqual(err.message, `Testing if the element count for <.test_element> is 1 in 5ms - expected "counts 1" but got: "2" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('not.elementsCount assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 2],
      commandResult: {
        value: [{'ELEMENT': '0'}, {'ELEMENT': '1'}]
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 2);
        assert.strictEqual(instance.getActual(), 2);
        assert.strictEqual(err.message, `Testing if the element count for <.test_element> is not 2 in 5ms - expected "does not count 2" but got: "2" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('elementCounts assertion passed with selector object', function() {
    return assertionTest({
      args: [{selector: '.test_element'}, 1],
      commandResult: {
        value: [{'ELEMENT': 0}]
      },
      assertArgs: true,
      assertResult: true,
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 1);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if the element count for <.test_element> is 1'), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('elementsCount assertion failed', function() {
    return assertionTest({
      args: ['.test_element', 2, 'Test message expected element %s to have count %s'],
      commandResult: {
        value: [{'ELMENT': 1}]
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 1);
        assert.strictEqual(instance.message, 'Test message expected element <.test_element> to have count 2');
        assert.strictEqual(failure, 'Expected "counts 2" but got: "1"');
      }
    });
  });

  it('elementsCount assertion - no elements found', function() {
    return assertionTest({
      args: ['.test_element', 2],
      commandResult: {
        status: 0,
        value: []
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if the element count for <.test_element> is 2 in 5ms - expected "counts 2" but got: "0" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 0);
        assert.strictEqual(instance.getActual(), 0);
      }
    });
  });
});
