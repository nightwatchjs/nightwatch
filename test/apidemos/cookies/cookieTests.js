const assert = require('assert');

describe('Cookie api demo tests', function() {

  before(async (browser) => {
    await browser.url('http://localhost');

    return new Promise(resolve => {
      setTimeout(function () {
        browser.globals.calls++;
        resolve();
      }, 200);
    });
  });

  after(async (browser) => {
    await browser.end();
    browser.globals.calls++;
  });

  test('browser.getCookie(<name>)', async (browser) => {
    await browser.assert.strictEqual(browser.globals.calls, 1);
    await browser.assert.urlContains('//localhost');

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
    assert.deepStrictEqual(cookies, [
      {
        name: 'test_cookie',
        value: '123456',
        path: '/',
        domain: 'example.org',
        secure: false
      }
    ]);
  });

  test('browser.cookies.get(<name>)', async (browser) => {
    await browser.assert.strictEqual(browser.globals.calls, 1);
    await browser.assert.urlContains('//localhost');

    const test_cookie = await browser.cookies.get('test_cookie');
    assert.deepStrictEqual(test_cookie, {
      name: 'test_cookie',
      value: '123456',
      path: '/',
      domain: 'example.org',
      secure: false
    });

    const other_cookie = await browser.cookies.get('other_cookie');
    assert.strictEqual(other_cookie, null);
  });

  test('browser.cookies.getAll()', async (browser) => {
    const cookies = await browser.cookies.getAll();
    assert.deepStrictEqual(cookies, [
      {
        name: 'test_cookie',
        value: '123456',
        path: '/',
        domain: 'example.org',
        secure: false
      }
    ]);
  });
});