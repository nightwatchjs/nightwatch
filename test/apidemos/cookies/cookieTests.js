const assert = require('assert');

describe('Cookie api demo tests', function() {

  before((browser) => browser.url('http://localhost'));
  after((browser) => browser.end());

  test('browser.getCookie(<name>)', async (browser) => {
    const test_cookie = await browser.getCookie('test_cookie');
    assert.deepStrictEqual(test_cookie, {
      name: 'test_cookie',
      value: '123456',
      path: '/',
      domain: 'example.org',
      secure: false
    });

    const other_cookie = await browser.getCookie('other_cookie');
    assert.strictEqual(other_cookie, null);
  });

  test('browser.getCookies()', async (browser) => {
    const cookies = await browser.getCookies();
    assert.deepStrictEqual(cookies, {
      value: [
        {
          name: 'test_cookie',
          value: '123456',
          path: '/',
          domain: 'example.org',
          secure: false
        }
      ]
    });
  });

});