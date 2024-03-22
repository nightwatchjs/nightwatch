const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.cssProperty', function () {
  const assertionName = 'cssProperty';
  const api = 'getCssProperty';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('cssProperty assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'display', 'none'],
      commandResult: {
        value: 'none'
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> has css property \'display: none\''), message);
      }
    });
  });

  it('not.cssProperty assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'display', 'none'],
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
        assert.strictEqual(instance.message, 'Testing if element <.test_element> doesn\'t have css property \'display: none\'');
        assert.ok(message.startsWith('Testing if element <.test_element> doesn\'t have css property \'display: none\''), message);
      }
    });
  });

  it('not.cssProperty assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'display', 'none'],
      commandResult: {
        value: 'none'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'none');
        assert.strictEqual(instance.getActual(), 'none');
        assert.strictEqual(err.message, `Testing if element <.test_element> doesn't have css property 'display: none' in 5ms - expected "not none" but got: "none" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('cssProperty assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}, 'display', 'none'],
      commandResult: {
        value: 'none'
      },
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'none');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> has css property \'display: none\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('cssProperty assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'display', 'none', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not_expected');
        assert.strictEqual(failure, 'Expected "none" but got: "not_expected"');
      }
    });
  });

  it('cssProperty assertion - element not found', function () {
    return assertionTest({
      args: ['.test_element', 'display', 'none', 'Test attribute %s from element "%s" == %s'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'none');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "none" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test attribute <.test_element> from element "'display" == none' in 5ms - expected "none" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributeEquals assertion - css property not found', function() {
    return assertionTest({
      args: ['.test_element', 'display', 'none'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if element <.test_element> has css property 'display: none' in 5ms - expected "none" but got: "Element does not have a 'display' css property" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a \'display\' css property');
      }
    });
  });
});

