const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.urlEquals', function () {
  const assertionName = 'urlEquals';
  const api = 'url';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('urlEquals assertion passed', function () {
    return assertionTest({
      args: ['https://nightwatchjs.org', 'Test message'],
      assertMessage: true,
      assertResult: true,
      commandResult: {
        value: 'https://nightwatchjs.org'
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('urlEquals assertion failed', function () {
    return assertionTest({
      args: ['https://ecosia.org'],
      commandResult: {
        value: 'https://nightwatchjs.org'
      },
      assertError: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org');
        assert.strictEqual(instance.expected(), 'is \'https://ecosia.org\'');
        assert.strictEqual(instance.getValue(), 'https://nightwatchjs.org');
        assert.strictEqual(failure, 'Expected "is \'https://ecosia.org\'" but got: "https://nightwatchjs.org"');
        assert.strictEqual(err.message, `Testing if the URL is 'https://ecosia.org' in 5ms - expected "is 'https://ecosia.org'" but got: "https://nightwatchjs.org" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.urlEquals assertion passed', function () {
    return assertionTest({
      args: ['https://nightwatchjs.org'],
      commandResult: {
        value: 'https://ecosia.org'
      },
      assertResult: true,
      negate: true,
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'https://ecosia.org');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('.not.urlEquals assertion failed', function () {
    return assertionTest({
      args: ['https://nightwatchjs.org'],
      commandResult: {
        value: 'https://nightwatchjs.org'
      },
      assertResult: true,
      negate: true,
      assertError: true,
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, 'Expected "is not \'https://nightwatchjs.org\'" but got: "https://nightwatchjs.org"');
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
