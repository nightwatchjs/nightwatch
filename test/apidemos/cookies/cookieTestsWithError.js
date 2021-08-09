const assert = require('assert');

describe('Cookie api demo tests', function() {

  before((browser) => browser.url('http://localhost'));
  after((browser) => browser.end());

  test('browser.getCookies() with network errors', async (browser) => {
    const cookies = await browser.getCookies();
    assert.ok(cookies.error instanceof Error);
    assert.strictEqual(cookies.error.code, 'ECONNRESET');
    assert.strictEqual(cookies.error.message, 'ECONNRESET socket hang up');
    assert.strictEqual(cookies.status, -1);
    assert.strictEqual(cookies.value, null);
    
  });

});