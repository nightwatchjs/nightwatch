const assert = require('assert');

describe('custom command using namespaced aliases', function () {
  it('test aliases are available on requested namespace', async function() {
    assert.strictEqual(typeof browser.customPauseWithNamespacedAlias, 'function');
    assert.strictEqual(typeof browser.newPause, 'function');
    assert.strictEqual(typeof browser.sampleNamespace.amazingPause, 'function');
    assert.strictEqual(typeof browser.fantasticNamespace.subNamespace.fantasticPause, 'function');
  });

  it('test custom command with a failure', async function() {
    browser.sampleNamespace.amazingPause('200');
  });
});
