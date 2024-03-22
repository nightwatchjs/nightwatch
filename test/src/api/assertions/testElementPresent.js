const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.elementPresent', function() {
  const assertionName = 'elementPresent';
  const api = 'elements';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('elementPresent assertion passed', function() {
    return assertionTest({
      args: ['.test_element', 'Test message'],
      commandResult: {
        status: 0,
        value: [{
          ELEMENT: '0'
        }]
      },
      assertMessage: true,
      assertApiCommandArgs(args) {
        assert.strictEqual(args[0], 'css selector');
        assert.strictEqual(typeof args[1], 'object');
        assert.strictEqual(args[1].toString(), '.test_element');
        assert.strictEqual(typeof args[2], 'function');
      },
      assertion({reporter, instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('not.elementPresent assertion passed', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        value: []
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'not present');
        assert.strictEqual(instance.getActual(), 'not present');
        assert.strictEqual(instance.message, 'Testing if element <.test_element> is not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is not present'), message);
      }
    });
  });

  it('not.elementPresent assertion failed', function () {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        value: [{
          ELEMENT: '0'
        }]
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'present');
        assert.strictEqual(instance.getActual(), 'present');
        assert.strictEqual(err.message, `Testing if element <.test_element> is not present in 5ms - expected "is not present" but got: "present" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('elementPresent assertion passed with selector object', function() {
    return assertionTest({
      args: [{selector: '.test_element'}],
      commandResult: {
        status: 0,
        value: [{
          ELEMENT: '0'
        }]
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args[0], 'css selector');
        assert.strictEqual(typeof args[1], 'object');
        assert.strictEqual(args[1].toString(), '.test_element');
        assert.strictEqual(typeof args[2], 'function');
      },

      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'present');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if element <.test_element> is present'), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('elementPresent assertion passed - with W3C Webdriver', function() {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        value: [{'element-6066-11e4-a52e-4f735466cecf': 'b8461b6b-7c4b-ac46-8b1a-7071c3b111f1'}]
      },
      assertion({instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('elementPresent assertion failed', function() {
    return assertionTest({
      args: ['.test_element'],
      commandResult: {
        status: 0,
        value: []
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not present');
        assert.strictEqual(failure, 'Expected "is present" but got: "not present"');
      }
    });
  });
});
