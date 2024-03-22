const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.titleContains', function () {
  const assertionName = 'titleContains';
  const api = 'title';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('titleContains assertion passed', function () {
    return assertionTest({
      args: ['Test Title', 'Test message'],
      assertMessage: true,
      assertResult: true,
      commandResult: {
        value: 'Test Title - '
      },
      assertApiCommandArgs(args) {
        assert.strictEqual(args.length, 1);
        assert.strictEqual(typeof args[0], 'function');
      },
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.getActual(), 'Test Title - ');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });

  it('titleContains assertion failed without value field in response', function () {
    return assertionTest({
      args: ['Test Title'],
      assertError: true,
      commandResult: {
        status: -1
      },
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), '');
        assert.strictEqual(instance.expected(), 'contains \'Test Title\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "contains \'Test Title\'" but got: ""');
        assert.strictEqual(err.message, `Testing if the page title contains 'Test Title' in 5ms - expected "contains 'Test Title'" but got: "" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('titleContains assertion failed with empty response', function () {
    return assertionTest({
      args: ['Test Title'],
      assertError: true,
      commandResult: '',
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), '');
        assert.strictEqual(instance.expected(), 'contains \'Test Title\'');
        assert.strictEqual(instance.getValue(), '');
        assert.strictEqual(failure, 'Expected "contains \'Test Title\'" but got: ""');
        assert.strictEqual(err.message, `Testing if the page title contains 'Test Title' in 5ms - expected "contains 'Test Title'" but got: "" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('titleContains assertion failed', function () {
    return assertionTest({
      args: ['Test Title'],
      assertError: true,
      commandResult: {
        value: 'Wrong Title'
      },
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'Wrong Title');
        assert.strictEqual(instance.expected(), 'contains \'Test Title\'');
        assert.strictEqual(instance.getValue(), 'Wrong Title');
        assert.strictEqual(failure, 'Expected "contains \'Test Title\'" but got: "Wrong Title"');
        assert.strictEqual(err.message, `Testing if the page title contains 'Test Title' in 5ms - expected "contains 'Test Title'" but got: "Wrong Title" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.titleContains assertion passed', function () {
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

  it('.not.titleContains assertion failed', function () {
    return assertionTest({
      args: ['Test Title'],
      assertResult: true,
      negate: true,
      commandResult: {
        value: 'Test Title'
      },
      assertError: true,
      assertion({reporter, instance, failure}) {
        assert.strictEqual(failure, 'Expected "not contains \'Test Title\'" but got: "Test Title"');
        assert.strictEqual(instance.getActual(), 'Test Title');
        assert.strictEqual(instance.hasFailure(), false);
      }
    });
  });
});
