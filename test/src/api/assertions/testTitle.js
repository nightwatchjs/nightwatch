const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.title', function () {
  const assertionName = 'title';
  const api = 'title';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('title assertion passed', function () {
    return assertionTest({
      args: ['Test Title', 'Test message'],
      assertMessage: true,
      assertResult: true,
      commandResult: {
        value: 'Test Title'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'Test Title');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('.not.title assertion passed', function () {
    return assertionTest({
      args: ['Test Title'],
      assertResult: true,
      negate: true,
      commandResult: {
        value: 'Other Title'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'Other Title');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('title assertion failed', function () {
    return assertionTest({
      args: ['Test Title'],
      assertError: true,
      assertResult: true,
      commandResult: {
        value: 'Wrong Title'
      },
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'Wrong Title');
        assert.strictEqual(instance.expected(), 'is \'Test Title\'');
        assert.strictEqual(instance.getValue(), 'Wrong Title');
        assert.strictEqual(failure, 'Expected "is \'Test Title\'" but got: "Wrong Title"');
        assert.strictEqual(err.message, `Testing if the page title equals 'Test Title' in 5ms - expected "is 'Test Title'" but got: "Wrong Title" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.title assertion failed', function () {
    return assertionTest({
      args: ['Test Title'],
      assertResult: true,
      negate: true,
      commandResult: {
        value: 'Test Title'
      },
      assertError: true,
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, 'Expected "is not \'Test Title\'" but got: "Test Title"');
        assert.strictEqual(instance.getActual(), 'Test Title');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});

