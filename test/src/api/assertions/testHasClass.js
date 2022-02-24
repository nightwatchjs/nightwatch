const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.hasClass', function () {
  const assertionName = 'hasClass';
  const api = 'getAttribute';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('hasClass assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class'],
      commandResult: {
        value: 'other-css-class test-css-class'
      },
      assertResult: true,
      assertApiCommandArgs(args) {
        assert.deepStrictEqual(args[0], {
          selector: '.test_element',
          suppressNotFoundErrors: true
        });
        assert.strictEqual(args[1], 'class');
        assert.strictEqual(typeof args[2], 'function');
      },
      assertion({reporter, instance, queueOpts, failure, message}) {
        assert.deepStrictEqual(instance.args, ['.test_element', 'test-css-class']);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other-css-class test-css-class');
        assert.ok(message.startsWith('Testing if element <.test_element> has css class \'test-css-class\''), message);
      }
    });
  });

  it('hasClass assertion passed - multiple values array', function () {
    return assertionTest({
      args: ['.test_element', ['test-css-class', 'other-css-class']],
      commandResult: {
        value: 'other-css-class test-css-class'
      },
      assertResult: true,
      assertApiCommandArgs(args) {
        assert.deepStrictEqual(args[0], {
          selector: '.test_element',
          suppressNotFoundErrors: true
        });
        assert.strictEqual(args[1], 'class');
        assert.strictEqual(typeof args[2], 'function');
      },
      assertion({reporter, instance, queueOpts, failure, message}) {
        assert.deepStrictEqual(instance.args, ['.test_element', ['test-css-class', 'other-css-class']]);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other-css-class test-css-class');
        assert.ok(message.startsWith('Testing if element <.test_element> has css class \'test-css-class other-css-class\''), message);
      }
    });
  });

  it('hasClass assertion passed - multiple values string', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class other-css-class'],
      commandResult: {
        value: 'other-css-class test-css-class'
      },
      assertResult: true,
      assertApiCommandArgs(args) {
        assert.deepStrictEqual(args[0], {
          selector: '.test_element',
          suppressNotFoundErrors: true
        });
        assert.strictEqual(args[1], 'class');
        assert.strictEqual(typeof args[2], 'function');
      },
      assertion({reporter, instance, queueOpts, failure, message}) {
        assert.deepStrictEqual(instance.args, ['.test_element', 'test-css-class other-css-class']);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other-css-class test-css-class');
        assert.ok(message.startsWith('Testing if element <.test_element> has css class \'test-css-class other-css-class\''), message);
      }
    });
  });

  it('not.hasClass assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class'],
      commandResult: {
        value: 'other-css-class'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other-css-class');
        assert.strictEqual(instance.getActual(), 'other-css-class');
        assert.strictEqual(instance.message, 'Testing if element <.test_element> doesn\'t have css class \'test-css-class\'');
        assert.ok(message.startsWith('Testing if element <.test_element> doesn\'t have css class \'test-css-class\''), message);
      }
    });
  });

  it('.not.hasClass assertion passed - multiple values string', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class other-css-class'],
      commandResult: {
        value: 'other-css-class'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, failure, message}) {
        assert.deepStrictEqual(instance.args, ['.test_element', 'test-css-class other-css-class']);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other-css-class');
        assert.ok(message.startsWith('Testing if element <.test_element> doesn\'t have css class \'test-css-class other-css-class\''), message);
      }
    });
  });

  it('not.hasClass assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class'],
      commandResult: {
        value: 'test-css-class other'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'test-css-class other');
        assert.strictEqual(instance.getActual(), 'test-css-class other');
        assert.strictEqual(instance.message, 'Testing if element <.test_element> doesn\'t have css class \'test-css-class\'');
        assert.ok(message.startsWith('Testing if element <.test_element> doesn\'t have css class \'test-css-class\''), message);
      }
    });
  });

  it('not.hasClass assertion failed - multiple classes', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class other'],
      commandResult: {
        value: 'other test-css-class'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other test-css-class');
        assert.strictEqual(instance.getActual(), 'other test-css-class');
        assert.strictEqual(instance.message, 'Testing if element <.test_element> doesn\'t have css class \'test-css-class other\'');
        assert.ok(message.startsWith('Testing if element <.test_element> doesn\'t have css class \'test-css-class other\' in 5ms - expected "has not test-css-class other" but got: "other test-css-class"'), message);
      }
    });
  });

  it('hasClass assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}, 'test-css-class'],
      commandResult: {
        value: 'other-css-class test-css-class'
      },
      assertResult: true,
      assertApiCommandArgs(args) {
        assert.deepStrictEqual(args[0], {selector: '.test_element', suppressNotFoundErrors: true});
        assert.strictEqual(args[1], 'class');
        assert.strictEqual(typeof args[2], 'function');
      },
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'other-css-class test-css-class');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> has css class \'test-css-class\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('hasClass assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class'],
      commandResult: {
        value: 'other-css-class'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'other-css-class');
        assert.strictEqual(failure, 'Expected "has test-css-class" but got: "other-css-class"');
      }
    });
  });

  it('hasClass assertion - element not found', function () {
    return assertionTest({
      args: ['.test_element', 'test-css-class', 'Element %s doesnt have css class "%s"'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'has test-css-class');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "has test-css-class" but got: "element could not be located"');
        assert.strictEqual(err.message, `Element <.test_element> doesnt have css class "'test-css-class'" in 5ms - expected "has test-css-class" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });
});
