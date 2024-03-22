const assert = require('assert');

describe('basicSampleTest', function() {

  it('basic test with ES6 async/await', async (browser) => {
    const currentUrl = await browser.url('http://localhost').url();
    assert.strictEqual(currentUrl, 'http://localhost');

    const assertResult = await browser.assert.elementPresent('#weblogin', function(result) {
      assert.deepStrictEqual(result, {value: [{ELEMENT: '0'}], status: 0, returned: 1, passed: true});
    });

    assert.deepStrictEqual(assertResult, {value: [{ELEMENT: '0'}], status: 0, returned: 1, passed: true});

    await browser.end();
  });

  it('basic test with ES6 async/await and no await commands', async (browser) => {
    browser
      .url('http://localhost')
      .assert.elementPresent('#weblogin');

    browser.assert.strictEqual(0, 1)
  });

  it('test with ES6 async/await assertion error and try/catch', async (browser) => {
    let error;
    try {
      await browser.assert.elementPresent('#badelement');
    } catch (err) {
      error = err;
    }

    assert.ok(error instanceof Error);
    assert.strictEqual(error.name, 'NightwatchAssertError');

    await browser.end();
  });

  xit('test with ES6 async/await perform error and try/catch', async (browser) => {
    let error;
    try {
      await browser.perform(async function() {
        throw new Error('Error from perform');
      });
    } catch (err) {
      error = err;
    }

    assert.ok(error instanceof Error);
    assert.strictEqual(error.message, 'Error while running "perform" command: Error from perform');

    await browser.end();
  });
});