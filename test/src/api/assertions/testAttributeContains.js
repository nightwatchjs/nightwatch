const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributeContains', function () {

  const assertionName = 'attributeContains';
  const api = 'getAttribute';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('attributeContains assertion passed', function() {
    return assertionTest({
      args: ['.test_element', 'href', 'google', 'Test message'],
      commandResult: {
        value: 'http://www.google.com'
      },
      assertArgs: true,
      assertMessage: true,
      assertion({reporter, instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
      }
    });
  });

  it('attributeContains assertion passed with backwards compat mode', function() {
    return assertionTest({
      args: ['.test_element', 'href', 'google', 'Test message'],
      commandResult: {
        value: 'http://www.google.com'
      },
      assertArgs: true,
      assertMessage: true,
      assertion({reporter, instance, failure}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
      },
      settings: {
        backwards_compatibility_mode: true
      }
    });
  });

  it('not.attributeContains assertion passed with backwards compat mode', function() {
    return assertionTest({
      args: ['.test_element', 'href', 'google'],
      commandResult: {
        value: 'http://ecosia.org'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'http://ecosia.org');
        assert.strictEqual(instance.getActual(), 'http://ecosia.org');
        assert.strictEqual(instance.message, 'Testing if attribute \'href\' of element <.test_element> doesn\'t contain \'google\'');
        assert.ok(message.startsWith('Testing if attribute \'href\' of element <.test_element> doesn\'t contain \'google\''), message);
      },
      settings: {
        backwards_compatibility_mode: true
      }
    });
  });

  it('not.attributeContains assertion passed', function() {
    return assertionTest({
      args: ['.test_element', 'href', 'google'],
      commandResult: {
        value: 'http://ecosia.org'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'http://ecosia.org');
        assert.strictEqual(instance.getActual(), 'http://ecosia.org');
        assert.strictEqual(instance.message, 'Testing if attribute \'href\' of element <.test_element> doesn\'t contain \'google\'');
        assert.ok(message.startsWith('Testing if attribute \'href\' of element <.test_element> doesn\'t contain \'google\''), message);
      }
    });
  });

  it('not.attributeContains assertion failed', function() {
    return assertionTest({
      args: ['.test_element', 'href', 'google'],
      commandResult: {
        value: 'http://google.org'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'http://google.org');
        assert.strictEqual(instance.getActual(), 'http://google.org');
        assert.strictEqual(err.message, `Testing if attribute 'href' of element <.test_element> doesn't contain 'google' in 5ms - expected "not contains 'google'" but got: "http://google.org" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributeContains assertion passed with selector object', function() {
    return assertionTest({
      args: [{
        selector: '.test_element'
      }, 'href', 'google'],
      commandResult: {
        value: 'http://google.com'
      },
      assertArgs: true,
      assertion({instance, failure, message}) {
        assert.strictEqual(instance.message, 'Testing if attribute \'href\' of element <.test_element> contains \'google\'');
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.elementSelector, '<.test_element>');

        assert.throws(function() {
          instance.api = {};
        }, /^Error: Attempting to override "\.api" which is a reserved property in "(.+)"\.$/);

        assert.throws(function() {
          instance.elementSelector = {};
        }, /^Error: Attempting to override "\.elementSelector" which is a reserved property in "(.+)"\.$/);

        assert.throws(function() {
          instance.args = {};
        }, /^Error: Attempting to override "\.args" which is a reserved property in "(.+)"\.$/);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getActual(), 'http://google.com');
        assert.ok(message.startsWith('Testing if attribute \'href\' of element <.test_element> contains \'google\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('attributeContains assertion failed', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'whatever', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not_expected');
        assert.strictEqual(failure, 'Expected "contains \'whatever\'" but got: "not_expected"');
      }
    });
  });

  it('attributeContains assertion - element not found', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'main'],
      commandResult: {
        value: [],
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'contains \'main\'');
        assert.strictEqual(failure, 'Expected "contains \'main\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Testing if attribute 'role' of element <.test_element> contains 'main' in 5ms - expected "contains 'main'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributeContains assertion - attribute not found', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'main'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a \'role\' attribute');
        assert.strictEqual(err.message, `Testing if attribute 'role' of element <.test_element> contains 'main' in 5ms - expected "contains 'main'" but got: "Element does not have a 'role' attribute" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('.not.attributeContains assertion - attribute not found', function() {
    return assertionTest({
      args: ['.test_element', 'role', 'main'],
      commandResult: {
        status: 0,
        value: null
      },
      negate: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a \'role\' attribute');
      }
    });
  });
});
