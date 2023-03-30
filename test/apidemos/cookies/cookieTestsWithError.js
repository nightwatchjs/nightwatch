const assert = require('assert');

describe('Cookie api demo tests', function() {

  before((browser) => browser.url('http://localhost'));
  after((browser) => browser.end());

  test('browser.getCookies() with network errors', async (browser) => {
    const cookies = await browser.getCookies(res => {
      assert.ok(res.error instanceof Error);
      assert.strictEqual(res.error.code, 'ECONNRESET');
      assert.strictEqual(res.error.message, 'ECONNRESET socket hang up');
      assert.strictEqual(res.status, -1);
      assert.strictEqual(res.value, null);
    });

    assert.strictEqual(cookies, null);
  });

  test('browser.cookies.getAll() with network errors', async (browser) => {
    const cookies = await browser.cookies.getAll(res => {
      assert.ok(res.error instanceof Error);
      assert.strictEqual(res.error.code, 'ECONNRESET');
      assert.strictEqual(res.error.message, 'ECONNRESET socket hang up');
      assert.strictEqual(res.status, -1);
      assert.strictEqual(res.value, null);
    });

    assert.strictEqual(cookies, null);
  });

});