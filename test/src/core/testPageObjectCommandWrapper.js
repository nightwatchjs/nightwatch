const assert = require('assert');
const CommandLoader = require('../../../lib/page-object/command-wrapper.js');
const Section = require('../../../lib/page-object/section.js');

describe('test Command.createWrapper() Promise propagation', function() {
  function createFakeParent(ParentClass) {
    // Object.create(ParentClass.prototype) satisfies "instanceof" checks without
    // having to go through the real (heavyweight) page-object constructors.
    const parent = Object.create(ParentClass.prototype);

    return Object.assign(parent, {
      client: {isES6AsyncTestcase: false},
      elements: {},
      sections: {},
      name: 'testParent'
    });
  }

  it('propagates a rejected Promise from a section-scoped custom command/assertion', function() {
    const parent = createFakeParent(Section);
    const rejectedPromise = Promise.reject(new Error('section assertion failed'));
    // silence node's own "unhandled rejection" warning for the raw promise fixture;
    // the assertions below still validate that createWrapper() returns this exact promise.
    rejectedPromise.catch(() => {});

    const wrapped = CommandLoader.addCommand({
      target: {},
      commandFn: () => rejectedPromise,
      commandName: 'customFailingSectionCommand',
      parent,
      isChaiAssertion: false
    });

    const result = wrapped.call(parent);

    assert.strictEqual(result, rejectedPromise, 'a Promise result from a section-scoped command must be ' +
      'returned as-is so a rejection propagates immediately, instead of being silently replaced with the ' +
      'section object (which used to hide the failure until retryAssertionTimeout was exceeded)');

    return result.catch(err => {
      assert.strictEqual(err.message, 'section assertion failed');
    });
  });

  it('still returns the parent for a section-scoped command that does not return a Promise', function() {
    const parent = createFakeParent(Section);

    const wrapped = CommandLoader.addCommand({
      target: {},
      commandFn: () => 'not-a-promise',
      commandName: 'customSyncSectionCommand',
      parent,
      isChaiAssertion: false
    });

    const result = wrapped.call(parent);

    assert.strictEqual(result, parent);
  });

  it('continues to propagate a rejected Promise from a page-scoped custom command/assertion', function() {
    class Page {}
    const parent = createFakeParent(Page);

    const rejectedPromise = Promise.reject(new Error('page assertion failed'));
    rejectedPromise.catch(() => {});

    const wrapped = CommandLoader.addCommand({
      target: {},
      commandFn: () => rejectedPromise,
      commandName: 'customFailingPageCommand',
      parent,
      isChaiAssertion: false
    });

    const result = wrapped.call(parent);

    assert.strictEqual(result, rejectedPromise);

    return result.catch(err => {
      assert.strictEqual(err.message, 'page assertion failed');
    });
  });
});
