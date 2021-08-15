const assert = require('assert');

module.exports = {
  'basic test with ES6 async/await': async (browser) => {
    const currentUrl = await browser
      .url('http://localhost').url();

    assert.strictEqual(currentUrl.value, 'http://localhost');

    const assertResult = await browser.assert.elementPresent('#weblogin');
    assert.deepStrictEqual(assertResult, {
      status: 0,
      value: [{ELEMENT: '0'}],
      returned: 1
    });

    await browser.end();
  }
};
