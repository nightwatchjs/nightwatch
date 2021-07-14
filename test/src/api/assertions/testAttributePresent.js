const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributePresent', function () {

  const assertionName = 'attributePresent';
  const api = 'getAttribute';

  function assertionTest(opts) {
    return Globals.assertion(assertionName, api, opts);
  }

  it('attributePresent assertion passed', function() {
    return assertionTest({
      args: ['.test_element', 'href', 'Test message'],
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

  it('not.attributePresent assertion passed', function() {
    return assertionTest({
      args: ['.test_element', 'href'],
      commandResult: {
        value: {}
      },
      negate: true,
      assertion({reporter, instance, queueOpts, message}) {
        assert.strictEqual(typeof err, 'undefined');
        assert.strictEqual(queueOpts.negate, true);

        assert.strictEqual(instance.hasFailure(), false);
        assert.deepStrictEqual(instance.getValue(), {});
        assert.strictEqual(instance.getActual(), false);
        assert.strictEqual(instance.message, 'Testing if attribute \'href\' of element <.test_element> is not present');
        assert.ok(message.startsWith('Testing if attribute \'href\' of element <.test_element> is not present'), message);
      }
    });
  });

  it('not.attributePresent assertion failed', function() {
    return assertionTest({
      args: ['.test_element', 'href'],
      commandResult: {
        value: 'http://google.org'
      },
      negate: true,
      assertError: true,
      assertion({instance, queueOpts, err}) {
        assert.strictEqual(queueOpts.negate, true);
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getValue(), 'http://google.org');
        assert.strictEqual(instance.getActual(), true);
        assert.strictEqual(err.message, `Error while running "attributePresent" command: Testing if attribute 'href' of element <.test_element> is not present in 5ms - expected "is not present" but got: "true" (${instance.elapsedTime}ms)`);
      }
    });
  });

  it('attributePresent assertion passed with selector object', function() {
    return assertionTest({
      args: [{
        selector: '.test_element'
      }, 'href'],
      commandResult: {
        value: 'http://google.com'
      },
      assertArgs: true,
      assertion({instance, failure, message}) {
        assert.strictEqual(instance.message, 'Testing if attribute \'href\' of element <.test_element> is present');
        assert.deepStrictEqual(instance.options, {elementSelector: true});
        assert.strictEqual(instance.elementSelector, '<.test_element>');
        assert.strictEqual(instance.hasFailure(), false);
        assert.strictEqual(instance.getActual(), true);
        assert.ok(message.startsWith('Testing if attribute \'href\' of element <.test_element> is present'), message);
        assert.strictEqual(failure, false);
      }
    });
  });
});
