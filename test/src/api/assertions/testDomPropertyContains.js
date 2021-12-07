const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.domPropertyEquals', function () {
  const assertionName = 'domPropertyContains';
  const api = 'getElementProperty';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('domPropertyContains assertion passed', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element'],
      commandResult: {
        value: 'visible-element'
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message, err}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(err, undefined);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'className\' of element <.test_element> contains \'visible-element\''), message);
      }
    });
  });

  it('domPropertyContains assertion passed - array result', function () {
    return assertionTest({
      args: ['.test_element', 'classList', ['visible-element']],
      commandResult: {
        value: ['visible-element']
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message, err}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(err, undefined);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'classList\' of element <.test_element> contains \'["visible-element"]\''), message);
      }
    });
  });

  it('domPropertyContains assertion passed - array result and string argument', function () {
    return assertionTest({
      args: ['.test_element', 'classList', 'visible-element'],
      commandResult: {
        value: ['visible-element']
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message, err}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(err, undefined);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'classList\' of element <.test_element> contains \'visible-element\''), message);
      }
    });
  });

  it('domPropertyContains assertion passed - array result and multiple string argument', function () {
    return assertionTest({
      args: ['.test_element', 'classList', 'visible,element'],
      commandResult: {
        value: ['visible', 'element']
      },
      assertArgs: true,
      assertion({reporter, instance, failure, message, err}) {
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(failure, false);
        assert.strictEqual(err, undefined);
        assert.strictEqual(instance.hasFailure(), false);
        assert.ok(message.startsWith('Testing if dom property \'classList\' of element <.test_element> contains \'visible,element\''), message);
      }
    });
  });

  it('not.domPropertyContains assertion passed', function () {
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
        assert.strictEqual(instance.message, 'Testing if dom property \'className\' of element <.test_element> doesn\'t contain \'visible-element\'');
        assert.ok(message.startsWith('Testing if dom property \'className\' of element <.test_element> doesn\'t contain \'visible-element\''), message);
      }
    });
  });

  it('not.domPropertyContains assertion failed', function () {
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
        assert.strictEqual(err.message, `Testing if dom property 'className' of element <.test_element> doesn't contain 'visible-element' in 5ms - expected "not contains 'visible-element'" but got: "visible-element" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('domPropertyContains assertion passed with selector object', function () {
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
        assert.ok(message.startsWith('Testing if dom property \'className\' of element <.test_element> contains \'visible-element\''), message);
        assert.strictEqual(failure, false);
      }
    });
  });

  it('domPropertyContains assertion failed', function () {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element', 'Test message'],
      commandResult: {
        value: 'not_expected'
      },
      assertError: true,
      assertResult: true,
      assertion({instance, failure}) {
        assert.strictEqual(instance.getActual(), 'not_expected');
        assert.strictEqual(failure, 'Expected "contains \'visible-element\'" but got: "not_expected"');
      }
    });
  });

  it('domPropertyContains assertion - element not found', function () {
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
        assert.strictEqual(instance.expected(), 'contains \'visible-element\'');
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(failure, 'Expected "contains \'visible-element\'" but got: "element could not be located"');
        assert.strictEqual(err.message, `Test attribute 'className' from element "<.test_element>" == 'visible-element' in 5ms - expected "contains 'visible-element'" but got: "element could not be located" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('domPropertyContains assertion - dom property not found', function() {
    return assertionTest({
      args: ['.test_element', 'className', 'visible-element'],
      commandResult: {
        status: 0,
        value: null
      },
      assertError: true,
      assertResult: true,
      assertion({instance, message, failure}) {
        assert.strictEqual(message, `Testing if dom property 'className' of element <.test_element> contains 'visible-element' in 5ms - expected "contains 'visible-element'" but got: "Element does not have a 'className' dom property" (${instance.elapsedTime}ms)`);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), null);
        assert.strictEqual(instance.getActual(), 'Element does not have a \'className\' dom property');
      }
    });
  });
});

