const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.urlMatches', function () {
  const assertionName = 'urlMatches';
  const api = 'url';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('urlMatches assertion passed', function () {
    return assertionTest({
      args: ['nightwatch', 'Test message'],
      assertMessage: true,
      assertResult: true,
      commandResult: {
        value: 'https://nightwatchjs.org/'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org/');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('urlMatches assertion failed', function () {
    return assertionTest({
      args: ['nightwatch'],
      commandResult: {
        value: 'John Doe'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'John Doe');
        assert.strictEqual(instance.expected(), 'matches \'nightwatch\'');
        assert.strictEqual(instance.getValue(), 'John Doe');
        assert.strictEqual(failure, 'Expected "matches \'nightwatch\'" but got: "John Doe"');
        assert.strictEqual(err.message, `Testing if the URL matches 'nightwatch' in 5ms - expected "matches 'nightwatch'" but got: "John Doe" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.urlMatches assertion passed', function () {
    return assertionTest({
      args: ['nightwatch'],
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

  it('.not.urlMatches assertion failed', function () {
    return assertionTest({
      args: ['nightwatch'],
      commandResult: {
        value: 'https://nightwatchjs.org/'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({instance, failure}) {
        assert.strictEqual(failure, 'Expected "does not matches \'nightwatch\'" but got: "https://nightwatchjs.org/"');
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org/');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
