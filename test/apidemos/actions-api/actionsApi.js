const assert = require('assert');

describe('Actions API demo tests', function() {

  before((browser) => browser.url('http://localhost'));
  after((browser) => browser.end());

  test('browser.perform() actions', async (browser) => {
    const result = await browser.perform(function() {
      const actions = this.actions({async: true});

      return actions
        .keyDown(Key.SHIFT)
        .keyUp(Key.SHIFT);
    });

    assert.strictEqual(result, undefined);
  });


});