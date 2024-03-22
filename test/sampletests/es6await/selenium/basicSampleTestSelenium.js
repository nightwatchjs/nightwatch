const assert = require('assert');

describe('basicSampleTest', function() {

  it('basic test with ES6 async/await', async (browser) => {
    const currentUrl = await browser.url('http://localhost').url();
    assert.strictEqual(currentUrl, 'http://localhost');

    const assertResult = await browser.assert.elementPresent('#weblogin', function(result) {
      assert.deepStrictEqual(result, {value: [{ELEMENT: '0'}], status: 0, returned: 1, passed: true});
    });

    assert.deepStrictEqual(assertResult, [{ELEMENT: '0'}]);

    await browser.end();
  });
});