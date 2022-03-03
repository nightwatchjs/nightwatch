const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.titleMatches', function () {
  const assertionName = 'titleMatches';
  const api = 'title';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('titleMatches assertion passed', function () {
    return assertionTest({
      args: ['^Night', 'Test message'],
      assertMessage: true,
      assertResult: true,
      commandResult: {
        value: 'Nightwatch.js'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'Nightwatch.js');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('titleMatches assertion failed', function () {
    return assertionTest({
      args: ['^Night'],
      commandResult: {
        value: 'John Doe'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'John Doe');
        assert.strictEqual(instance.expected(), 'matches \'^Night\'');
        assert.strictEqual(instance.getValue(), 'John Doe');
        assert.strictEqual(failure, 'Expected "matches \'^Night\'" but got: "John Doe"');
        assert.strictEqual(err.message, `Testing if the page title matches '^Night' in 5ms - expected "matches '^Night'" but got: "John Doe" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.titleMatches assertion passed', function () {
    return assertionTest({
      args: ['^Night'],
      commandResult: {
        value: 'John Doe'
      },
      assertResult: true,
      negate: true,
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'John Doe');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('.not.titleMatches assertion failed', function () {
    return assertionTest({
      args: ['^Night'],
      commandResult: {
        value: 'Nightwatch.js'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({instance, failure}) {
        assert.strictEqual(failure, 'Expected "does not matches \'^Night\'" but got: "Nightwatch.js"');
        assert.strictEqual(instance.getActual(), 'Nightwatch.js');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
