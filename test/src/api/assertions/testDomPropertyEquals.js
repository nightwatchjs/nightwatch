const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.domPropertyEquals', function () {
  const assertionName = 'domPropertyEquals';
  const api = 'getElementProperty';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('domPropertyEquals assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element'],
      commandResult: {
        value: 'visible-element'
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'className\' of element <.test_element> equals \'visible-element\''), message);
      }
    });
  });

  it('domPropertyEquals assertion passed - array result', function () {
    return assertionTest({
      args: ['.test_element', 'classList', ['visible-element']],
      commandResult: {
        value: ['visible-element']
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'classList\' of element <.test_element> equals \'["visible-element"]\''), message);
      }
    });
  });

  it('domPropertyEquals assertion passed - object result', function () {
    return assertionTest({
      args: ['.test_element', 'domProp', {result: 'some-value'}],
      commandResult: {
        value: {result: 'some-value'}
      },
      assertion({reporter, instance, failure, err, message}) {
        assert.strictEqual(err, undefined);
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'domProp\' of element <.test_element> equals \'{"result":"some-value"}\''), message);
      }
    });
  });

  it('domPropertyEquals assertion failed - object result with circular reference', function () {
    return assertionTest({
      args: ['.test_element', 'domProp', {result: global}],
      commandResult: {
        value: {result: 'some-value'}
      },
      assertError: true,
      assertion({reporter, instance, failure, err, message}) {
        assert.strictEqual(failure, 'Expected "[object Object]" but got: "[object Object]"');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.includes('TypeError Converting circular structure to JSON'), message);
      }
    });
  });

  it('domPropertyEquals assertion passed - array result and string argument', function () {
    return assertionTest({
      args: ['.test_element', 'classList', 'visible-element'],
      commandResult: {
        value: ['visible-element']
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'classList\' of element <.test_element> equals \'visible-element\''), message);
      }
    });
  });

  it('domPropertyEquals assertion passed - array result and string argument with comma-separated values', function () {
    return assertionTest({
      args: ['.test_element', 'classList', 'visible,element'],
      commandResult: {
        value: ['visible', 'element']
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'classList\' of element <.test_element> equals \'visible,element\''), message);
      }
    });
  });

  it('not.domPropertyEquals assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element'],
      commandResult: {
        value: 'other-classname'
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'other-classname');
        assert.strictEqual(instance.getActual(), 'other-classname');
        assert.strictEqual(instance.message, 'Testing if dom property \'className\' of element <.test_element> doesn\'t equal \'visible-element\'');
        assert.ok(message.startsWith('Testing if dom property \'className\' of element <.test_element> doesn\'t equal \'visible-element\''), message);
      }
    });
  });

  it('not.domPropertyEquals assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element'],
      commandResult: {
        value: 'visible-element'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'visible-element');
        assert.strictEqual(instance.getActual(), 'visible-element');
        assert.strictEqual(err.message, `Testing if dom property 'className' of element <.test_element> doesn't equal 'visible-element' in 5ms - expected "not visible-element" but got: "visible-element" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('domPropertyEquals assertion passed with selector object', function () {
    return assertionTest({
      args: [{selector: '.test_element'}, 'className', 'visible-element'],
      commandResult: {
        value: 'visible-element'
      },
      assertion({instance, failure, message, err}) {
        assert.strictEqual(err, undefined);
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.getActual(), 'visible-element');
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'className\' of element <.test_element> equals \'visible-element\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('domPropertyEquals assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not_expected');
        assert.strictEqual(failure, 'Expected "visible-element" but got: "not_expected"');
      }
    });
  });

  it('domPropertyEquals assertion - element not found', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element', 'Test attribute %s from element "%s" == %s'],
      commandResult: {
        status: -1
      },
      assertError: true,
      assertFailure: true,
      assertResult: true,
      assertion({instance, failure, err}) {
        assert.strictEqual(instance.getActual(), 'element could not be located');
        assert.strictEqual(instance.expected(), 'visible-element');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "visible-element" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test attribute 'className' from element "<.test_element>" == 'visible-element' in 5ms - expected "visible-element" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('domPropertyEquals assertion - dom property not found', function() {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if dom property 'className' of element <.test_element> equals 'visible-element' in 5ms - expected "visible-element" but got: "Element does not have a 'className' dom property" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a \'className\' dom property');
      }
    });
  });
});

