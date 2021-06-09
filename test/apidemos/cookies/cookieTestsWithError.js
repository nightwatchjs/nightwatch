const assert = require('assert');

describe('Cookie api demo tests', function() {

  before((browser) => browser.url('http://localhost'));
  after((browser) => browser.end());

  test('browser.getCookies() with network errors', async (browser) => {
    const cookies = await browser.getCookies();
    assert.deepStrictEqual(cookies, {
      code: 'ECONNRESET',
      error: 'ECONNRESET socket hang up',
      status: -1,
      name: 'Error',
      value: {
        message: 'ECONNRESET socket hang up'
      }
    });
  });

});