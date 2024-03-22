const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.titleEquals', function () {
  const assertionName = 'titleEquals';
  const api = 'title';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('titleEquals assertion passed', function () {
    return assertionTest({
      args: ['Nightwatch.js', 'Test message'],
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

  it('titleEquals assertion failed', function () {
    return assertionTest({
      args: ['Nightwatch.js'],
      commandResult: {
        value: 'John Doe'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'John Doe');
        assert.strictEqual(instance.expected(), 'is \'Nightwatch.js\'');
        assert.strictEqual(instance.getValue(), 'John Doe');
        assert.strictEqual(failure, 'Expected "is \'Nightwatch.js\'" but got: "John Doe"');
        assert.strictEqual(err.message, `Testing if the page title equals 'Nightwatch.js' in 5ms - expected "is 'Nightwatch.js'" but got: "John Doe" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.titleEquals assertion passed', function () {
    return assertionTest({
      args: ['Nightwatch.js'],
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

  it('.not.titleEquals assertion failed', function () {
    return assertionTest({
      args: ['Nightwatch.js'],
      commandResult: {
        value: 'Nightwatch.js'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({instance, failure}) {
        assert.strictEqual(failure, 'Expected "is not \'Nightwatch.js\'" but got: "Nightwatch.js"');
        assert.strictEqual(instance.getActual(), 'Nightwatch.js');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
