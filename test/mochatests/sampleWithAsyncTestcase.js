const assert = require('assert');

describe('Mocha tests with async testcase', function() {

  before(async function(browser) {
    browser.globals.test_calls++;

    const result = await browser.perform(function() {
      return browser.globals.test_calls;
    });

    assert.strictEqual(result, 1);
  });

  it('demoTest with Promise', async function (browser) {
    const elements = await browser
      .url('http://localhost')
      .findElements('#weblogin');

    assert.strictEqual(elements.length, 1);
    assert.strictEqual(elements[0].getId(), '0');

    browser.globals.test_calls++;
    await browser.end();
  });

  after(async function(browser) {
    browser.globals.test_calls++;
    const result = await browser.perform(function() {
      return browser.globals.test_calls;
    });

    assert.strictEqual(result, 3);
  });
});
