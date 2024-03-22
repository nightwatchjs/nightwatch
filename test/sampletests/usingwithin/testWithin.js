module.exports = {
  demoTest: async function (browser) {
    browser.url('http://localhost');

    const context = browser.within('#weblogin');
    const result = await context.click('button');

    browser.assert.strictEqual(typeof context.assert, 'undefined');
    browser.assert.strictEqual(typeof context.debug, 'undefined');
    //browser.assert.strictEqual(typeof context.customClearValue, 'function', 'customClearValue should be loaded');
  }
};
