const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.urlContains', function () {
  const assertionName = 'urlContains';
  const api = 'url';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('urlContains assertion passed', function () {
    return assertionTest({
      args: ['nightwatchjs', 'Test message'],
      commandResult: {
        value: 'https://nightwatchjs.org'
      },
      assertMessage: true,
      assertResult: true,
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({reporter, instance, failure, err}) {
        assert.strictEqual(err, undefined);
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('urlContains assertion failed without value field in response', function () {
    return assertionTest({
      args: ['nightwatchjs'],
      assertError: true,
      commandResult: {
        status: -1
      },
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), '');
        assert.strictEqual(instance.expected(), 'contains \'nightwatchjs\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "contains \'nightwatchjs\'" but got: ""');
        assert.strictEqual(err.message, `Testing if the URL contains 'nightwatchjs' in 5ms - expected "contains 'nightwatchjs'" but got: "" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('urlContains assertion failed with empty response', function () {
    return assertionTest({
      args: ['nightwatchjs'],
      assertError: true,
      commandResult: '',
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), '');
        assert.strictEqual(instance.expected(), 'contains \'nightwatchjs\'');
        assert.strictEqual(instance.getValue(), '');
        assert.strictEqual(failure, 'Expected "contains \'nightwatchjs\'" but got: ""');
        assert.strictEqual(err.message, `Testing if the URL contains 'nightwatchjs' in 5ms - expected "contains 'nightwatchjs'" but got: "" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('urlContains assertion failed', function () {
    return assertionTest({
      args: ['http://'],
      commandResult: {
        value: 'https://nightwatchjs.org'
      },
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org');
        assert.strictEqual(instance.expected(), 'contains \'http://\'');
        assert.strictEqual(instance.getValue(), 'https://nightwatchjs.org');
        assert.strictEqual(failure, 'Expected "contains \'http://\'" but got: "https://nightwatchjs.org"');
        assert.strictEqual(err.message, `Testing if the URL contains 'http://' in 5ms - expected "contains 'http://'" but got: "https://nightwatchjs.org" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.urlContains assertion passed', function () {
    return assertionTest({
      args: ['http://'],
      assertResult: true,
      negate: true,
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

  it('.not.urlContains assertion failed', function () {
    return assertionTest({
      args: ['https://nightwatchjs.org'],
      assertResult: true,
      negate: true,
      commandResult: {
        value: 'https://nightwatchjs.org'
      },
      assertError: true,
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, 'Expected "not contains \'https://nightwatchjs.org\'" but got: "https://nightwatchjs.org"');
        assert.strictEqual(instance.getActual(), 'https://nightwatchjs.org');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
