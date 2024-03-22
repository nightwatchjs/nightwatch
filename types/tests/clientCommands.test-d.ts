import { expectError, expectType } from 'tsd';
import { Cookie, NightwatchAPI, NightwatchCallbackResult, NightwatchElement, NightwatchLogEntry } from '..';

//
// .navigateTo
//
describe('Navigation commands demo', function () {
  test('demoTest', function (browser) {
    // navigate to new url:
    browser.navigateTo('https://nightwatchjs.org');
    // with callback
    browser.navigateTo('https://nightwatchjs.org', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
      expectError(this.navigateTo());
    });
  });

  test('demoTestAsync', async function (browser) {
    const result = await browser.navigateTo('https://nightwatchjs.org');
    expectType<null>(result);
  });
});

//
// .openNewWindow
//
describe('openNewWindow demo', function () {
  test('demo test', function (browser) {
    // open a new window tab (default)
    browser.openNewWindow('tab', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });

    // open a new window
    browser.openNewWindow('window', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.openNewWindow('window');
    expectType<null>(result);
  });
});

//
// .closeWindow
//
describe('closeWindow demo', function () {
  test('demo test', function (browser) {
    browser.closeWindow(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.closeWindow();
    expectType<null>(result);
  });
});

//
// .fullscreenWindow
//
describe('fullscreenWindow demo', function () {
  test('demo test', function (browser) {
    browser.fullscreenWindow(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.fullscreenWindow();
    expectType<null>(result);
  });
});

//
// .minimizeWindow
//
describe('minimizeWindow demo', function () {
  test('demo test', function (browser) {
    browser.minimizeWindow(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.minimizeWindow();
    expectType<null>(result);
  });
});

//
// .deleteCookie
//
describe('deleteCookie demo', function () {
  test('demo test', function (browser) {
    browser
      .navigateTo('https://www.google.com')
      .setCookie({
        name: 'test_cookie',
        value: 'test_value',
      })
      .deleteCookie('test_cookie', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
  });

  test('async demo test', async function (browser) {
    const result = await browser.deleteCookie('test_cookie');
    expectType<null>(result);
  });
});

//
// .deleteCookies
//
describe('deleteCookies demo', function () {
  test('demo test', function (browser) {
    browser
      .navigateTo('https://www.google.com')
      .setCookie({
        name: 'test_cookie',
        value: 'test_value',
      })
      .deleteCookies(function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
  });

  test('async demo test', async function (browser) {
    const result = await browser.deleteCookies();
    expectType<null>(result);
  });
});

//
// .end
//
describe('end command demo', function () {
  test('demo test', function (browser) {
    browser.end(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });
});

//
// .getCookie
//
describe('getCookie command demo', function () {
  test('demo test', function (browser) {
    browser
      .navigateTo('https://www.google.com')
      .setCookie({
        name: 'test_cookie',
        value: 'test_value',
      })
      .getCookie('test_cookie', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<Cookie>>(result);
      });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getCookie('test_cookie');
    expectType<Cookie>(result);
  });
});

//
// .setCookie
//
describe('setCookie command demo', function () {
  test('demo test', function (browser) {
    browser.navigateTo('https://www.google.com').setCookie(
      {
        name: 'test_cookie',
        value: 'test_value',
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      }
    );
  });

  test('async demo test', async function (browser) {
    const result = await browser.setCookie({
      name: 'test_cookie',
      value: 'test_value',
    });
    expectType<null>(result);
  });
});

//
// .getLog
//
describe('getLog command demo', function () {
  test('demo test', function () {
    browser.getLog('browser', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchLogEntry[]>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getLog('browser');
    expectType<NightwatchLogEntry[]>(result);
  });
});

//
// .getCurrentUrl
//
describe('getCurrentUrl command demo', function () {
  test('demo test', function () {
    browser.navigateTo('https://www.nightwatchjs.org').getCurrentUrl(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.navigateTo('https://www.nightwatchjs.org').getCurrentUrl();
    expectType<string>(result);
  });
});

//
// .getTitle
//
describe('getTitle command demo', function () {
  test('demo test', function () {
    browser.navigateTo('https://www.ecosia.org').getTitle(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<string>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.navigateTo('https://www.ecosia.org').getTitle();
    expectType<string>(result);
  });
});

//
// .isLogAvailable
//
describe('isLogAvailable command demo', function () {
  test('demo test', function () {
    browser.isLogAvailable('browser', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<boolean>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.isLogAvailable('browser');
    expectType<boolean>(result);
  });
});

//
// .resizeWindow
//
describe('resizeWindow command demo', function () {
  test('demo test', function () {
    browser.navigateTo('https://www.ecosia.org').resizeWindow(1000, 500, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.resizeWindow(1000, 800);
    expectType<null>(result);
  });
});

//
// .screenshot
//
describe('screenshot command demo', function () {
  test('demo test', function (browser) {
    browser
      .screenshot(function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string>>(result);
      })
      .screenshot(true, function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string>>(result);
      });
  });

  test('async demo test', async function (browser) {
    const result = await browser.screenshot();
    expectType<string>(result);

    const result2 = await browser.screenshot(true);
    expectType<string>(result2);
  });
});

//
// .saveScreenshot
//
describe('saveScreenshot command demo', function () {
  test('async demo test', async function (browser) {
    const result = await browser.saveScreenshot('bcd.jpg');
    expectType<string>(result);
  });
});

//
// .setCookie
//
describe('setCookie command demo', function () {
  test('demo test', function () {
    return browser.navigateTo('https://www.ecosia.org').setCookie(
      {
        name: 'testCookie',
        value: '',
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      }
    );
  });

  test('async demo test', async function (browser) {
    const result = await browser.setCookie({
      name: 'testCookie',
      value: '',
    });
    expectType<null>(result);
  });
});

//
// .setWindowPosition
//
describe('setWindowPosition command demo', function () {
  test('demo test', function () {
    browser.setWindowPosition(0, 0, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.setWindowPosition(0, 0);
    expectType<null>(result);
  });
});

//
// .setWindowRect
//
describe('setWindowRect command demo', function () {
  test('demo test', function () {
    browser.setWindowRect({ x: 0, y: 0, width: 500, height: 500 }, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });
  test('async demo test', async function (browser) {
    const result = await browser.setWindowRect({ x: 0, y: 0, width: 500, height: 500 });
    expectType<null>(result);
  });
});

//
// .setWindowSize
//
describe('setWindowSize command demo', function () {
  test('demo test', function () {
    browser.setWindowSize(500, 500, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.setWindowSize(500, 500);
    expectType<null>(result);
  });
});

//
// switchWindow
//
describe('switchWindow command demo', function () {
  test('async demo test', async function (browser) {
    const handle = await browser.windowHandle();
    const result = await browser.switchWindow(handle);
    expectType<null>(result);
  });
});

//
// switchToWindow
//
describe('switchToWindow command demo', function () {
  test('async demo test', async function (browser) {
    const handle = await browser.windowHandle();
    const result = await browser.switchToWindow(handle);
    expectType<null>(result);
  });
});

//
// .init
//
describe('init command demo', function () {
  test('demo test', function () {
    browser.init('https://www.google.com', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });
});

//
// .waitUntil
//
describe('waitUntil command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function () {
    browser.waitUntil(
      async function () {
        expectType<NightwatchAPI>(this);
        return true;
      },
      5000,
      5000,
      function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      }
    );
  });
  it('demo Test 2', function() {
    browser
      .url('https://nightwatchjs.org')
      .waitUntil(async function() {
        const title = await this.execute(function() {
          return document.title;
        });

        return title === 'Nightwatch.js';
      }, 1000, 100, 'some message');
  });
  test('async demo test', async function () {
    const result = await browser.waitUntil(async function () {
      return true;
    });
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .axeInject
//
describe('axeInject test', function () {
  test('async demo test', async function (browser) {
    const result = await browser.axeInject();
    expectType<null>(result);
  });
  after((browser) => browser.end());
});

//
// .injectScript
//
describe('injectScript command demo', function() {
    before(browser => browser.url('https://www.google.com/'));

    test('demo test', function(browser) {
        browser.injectScript('<script-url>', function(result) {
            expectType<NightwatchAPI>(this);
            expectType<NightwatchCallbackResult<NightwatchElement>>(result);
        });
        browser.injectScript('<script-url>', 'id', function(result) {
            expectType<NightwatchAPI>(this);
            expectType<NightwatchCallbackResult<NightwatchElement>>(result);
        });
    });

    test('async demo test', async function(browser) {
        const result = await browser.injectScript('<script-url>');
        expectType<NightwatchElement>(result);

        const result2 = await browser.injectScript('<script-url>', 'id');
        expectType<NightwatchElement>(result2);
    });

    after(browser => browser.end());
});

//
// .perform
//
describe('perform command demo', function() {
  test('demo test', function() {
    browser.perform(async function() {
      expectType<NightwatchAPI>(this);
    });
    browser.perform(function() {
      expectType<NightwatchAPI>(this);
    });
    browser.perform(function(done: () => void) {
      expectType<NightwatchAPI>(this);
      done();
    });
    browser.perform(function(client: NightwatchAPI, done: () => void) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchAPI>(client);
      done();
    });
  });

  test('async demo test', async function() {
    const result = await browser.perform(function() {
      expectType<NightwatchAPI>(this); 
      return '';
    })
    expectType<string>(result);

    const result2 = await browser.perform(async function() {
      expectType<NightwatchAPI>(this); 
      return true;
    })
    expectType<boolean>(result2);

    const result3 = await browser.perform(function(done: (result?: number) => void) {
      expectType<NightwatchAPI>(this);
      done(2);
    });
    expectType<number>(result3);

    const result4 = await browser.perform(function(client: NightwatchAPI, done: (result?: string) => void) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchAPI>(client);

      client.getTitle((result) => {
        done(result);
      });
    });
    expectType<string>(result4);
  });
});
