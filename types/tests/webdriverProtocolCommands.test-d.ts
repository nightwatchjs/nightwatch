import { expectError, expectType } from 'tsd';
import {
  NightwatchSizeAndPosition,
  Cookie,
  JSON_WEB_OBJECT,
  NightwatchLogEntry,
  WindowPosition,
  WindowSizeAndPosition,
  NightwatchLogTypes,
  ElementResult,
  NightwatchCallbackResult,
  NightwatchAPI,
} from '..';
import { WebElement } from 'selenium-webdriver';

//
// .elementIdAttribute
//
describe('elementIdAttribute command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdAttribute(webElement.getId(), 'title', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string | null>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdAttribute(webElement.getId(), 'title');
    expectType<string | null>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdCssProperty
//
describe('elementIdCssProperty command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdCssProperty(webElement.getId(), 'background-color', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdCssProperty(webElement.getId(), 'background-color');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdDisplayed
//
describe('elementIdDisplayed command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdDisplayed(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<boolean>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdDisplayed(webElement.getId());
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdEnabled
//
describe('elementIdEnabled command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdEnabled(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<boolean>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdEnabled(webElement.getId());
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdName
//
describe('elementIdName command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdName(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdName(webElement.getId());
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdSelected
//
describe('elementIdSelected command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdSelected(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<boolean>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdSelected(webElement.getId());
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .submit
//
describe('submit command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.submit(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.submit(webElement.getId());
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdSize
//
describe('elementIdSize command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdSize(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<NightwatchSizeAndPosition>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdSize(webElement.getId());
    expectType<NightwatchSizeAndPosition>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdText
//
describe('elementIdText command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdText(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdText(webElement.getId());
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdClear
//
describe('elementIdClear command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdClear(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdClear(webElement.getId());
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdClick
//
describe('elementIdClick command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdClick(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdClick(webElement.getId());
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdValue
//
describe('elementIdValue command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdValue(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<string>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdValue(webElement.getId());
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdLocation
//
describe('elementIdLocation command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdLocation(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<NightwatchSizeAndPosition>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdLocation(webElement.getId());
    expectType<NightwatchSizeAndPosition>(result);
  });

  after((browser) => browser.end());
});

//
// .source
//
describe('source command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.source(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.source();
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .doubleClick
//
describe('doubleClick command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.doubleClick('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.doubleClick('input[type=text]');
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .clickAndHold
//
describe('clickAndHold command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.clickAndHold('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.clickAndHold('input[type=text]');
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .moveTo
//
describe('moveTo command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.moveTo(null, 100, 100, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.moveTo(100, 100);
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .rightClick
//
describe('rightClick command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.rightClick('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.rightClick('input[type=text]');
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .acceptAlert
//
describe('acceptAlert command demo', function () {
  before((browser) => browser.url('https://nightwatchjs.org/__e2e/window/alerts.html/'));

  test('demo test', function (browser) {
    browser.click({selector: '#show-alert', locateStrategy: 'accessibility id'}).acceptAlert(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.click('#show-alert').acceptAlert();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .dismissAlert
//
describe('dismissAlert command demo', function () {
  before((browser) => browser.url('https://nightwatchjs.org/__e2e/window/alerts.html/'));

  test('demo test', function (browser) {
    browser.click('#show-alert').dismissAlert(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.click('#show-alert').dismissAlert();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .getAlertText
//
describe('getAlertText command demo', function () {
  before((browser) => browser.url('https://nightwatchjs.org/__e2e/window/alerts.html/'));

  test('demo test', function (browser) {
    browser.click('#show-alert').getAlertText(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.click('#show-alert').getAlertText();
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .setAlertText
//
describe('setAlertText command demo', function () {
  before((browser) => browser.url('https://nightwatchjs.org/__e2e/window/alerts.html/'));

  test('demo test', function (browser) {
    browser.click('#show-alert').setAlertText('nightwatch', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.click('#show-alert').setAlertText('nightwatch');
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .registerBasicAuth
//
describe('registerBasicAuth command demo', function () {
  test('demo test', function (browser) {
    browser.registerBasicAuth('test', 'test', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.registerBasicAuth('test', 'test');
    expectType<null>(result);
  });
});

//
// .cookie
//
describe('cookie command demo', function () {
  test('demo test', function (browser) {
    browser.cookie('GET', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<Cookie[] | null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.cookie('DELETE', 'sample');
    expectType<null>(result);
  });
});

//
// .session
//
describe('session command demo', function () {
  test('demo test', function (browser) {
    browser.session(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<Record<string, any>>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.session();
    expectType<Record<string, any>>(result);
  });
});

//
// .sessionLog
//
describe('sessionLog command demo', function () {
  test('demo test', function (browser) {
    browser.sessionLog('driver', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<NightwatchLogEntry[]>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.sessionLog('driver');
    expectType<NightwatchLogEntry[]>(result);
  });
});

//
// .sessionLogTypes
//
describe('sessionLogTypes command demo', function () {
  test('demo test', function (browser) {
    browser.sessionLogTypes(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<NightwatchLogTypes[]>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.sessionLogTypes();
    expectType<NightwatchLogTypes[]>(result);
  });
});

//
// .url
//
describe('url command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.url(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.url();
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .title
//
describe('title command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.title(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.title();
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .back
//
describe('back command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.back(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.back();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .forward
//
describe('forward command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.forward(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.forward();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .refresh
//
describe('refresh command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.refresh(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.refresh();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .windowHandle
//
describe('windowHandle command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.windowHandle(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.windowHandle();
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .windowMaximize
//
describe('windowMaximize command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.windowMaximize('current', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.windowMaximize();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .windowPosition
//
describe('windowPosition command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.windowPosition('current', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<WindowPosition>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.windowPosition('current', 22, 47);
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .windowSize
//
describe('windowSize command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.windowSize('current', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<WindowSizeAndPosition>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.windowSize('current', 746, 1200);
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .windowRect
//
describe('windowRect command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.windowRect({ width: 100, height: 100 }, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.windowRect(null);
    expectType<WindowSizeAndPosition>(result);
  });

  after((browser) => browser.end());
});

//
// .frame
//
describe('frame command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.frame(null, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.frame(null);
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .frameParent
//
describe('frameParent command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.frame(null).frameParent(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.frame(null).frameParent();
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdElement
//
describe('elementIdElement command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdElement(webElement.getId(), 'css selector', 'body', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<ElementResult | []>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdElement(webElement.getId(), 'css selector', 'body');
    expectType<ElementResult | []>(result);
  });

  after((browser) => browser.end());
});

//
// .elementIdDoubleClick
//
describe('elementIdDoubleClick command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.findElement('input[type=text]', function (result) {
      const webElement = result.value as JSON_WEB_OBJECT;
      browser.elementIdDoubleClick(webElement.getId(), function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
    });
  });

  test('async demo test', async function (browser) {
    const webElement = await browser.findElement('input[type=text]');
    const result = await browser.elementIdDoubleClick(webElement.getId());
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .elementActive
//
describe('elementActive command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function (browser) {
    browser.elementActive(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.elementActive();
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .element
//
describe('element command demo', function() {
    before(browser => browser.url('https://www.google.com/'));

    test('demo test', function() {
      browser.element('css selector', 'body');
    });

    test('async demo test', async function() {
      const result = await browser.element('css selector', 'body');
      expectType<WebElement>(result);
    });

    after(browser => browser.end());
});

//
// .execute
//
describe('execute command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', async function (browser) {
    const result1 = await browser.execute(function () {});
    expectType<null>(result1);

    const result2 = await browser.execute(function () {
      return 'nightwatch';
    });
    expectType<string>(result2);

    expectError(await browser.execute(function (arg1: string) {
      return 'nightwatch';
    }))

    await browser.execute(
      function (arg1: string) {
        return 'nightwatch';
      },
      ['js']
    );

    expectError(await browser.execute(
      function (arg1: string) {
        return 'nightwatch';
      },
      [123]
    ))

    expectError(await browser.execute(
      function (arg1: string) {
        return 'nightwatch';
      },
      ['js', 123]
    ))

    const result3 = await browser.execute('something');
    expectType<unknown>(result3)
    
    const result4 = await browser.execute('something', ['something', 5]);
    expectType<unknown>(result4)
  });

  after((browser) => browser.end());
});

//
// .executeScript
//
describe('executeScript command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', async function (browser) {
    const result1 = await browser.executeScript(function () {});
    expectType<null>(result1);

    const result2 = await browser.executeScript(function () {
      return 'nightwatch';
    });
    expectType<string>(result2);

    const result3 = await browser.executeScript(
      function (arg1) {
        return arg1;
      },
      ['nightwatch']
    );
    expectType<string>(result3);

    expectError(await browser.executeScript(function (arg1: string) {
      return 'nightwatch';
    }))

    await browser.executeScript(
      function (arg1: string) {
        return 'nightwatch';
      },
      ['js']
    );

    expectError(await browser.executeScript(
      function (arg1: string) {
        return 'nightwatch';
      },
      [123]
    ))

    expectError(await browser.executeScript(
      function (arg1: string) {
        return 'nightwatch';
      },
      ['js', 123]
    ))

    const result4 = await browser.execute('something');
    expectType<unknown>(result4)

    const result5 = await browser.execute('something', ['something', 5]);
    expectType<unknown>(result5)
  });

  after((browser) => browser.end());
});

//
// .executeAsyncScript
//
describe('executeAsyncScript command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', async function (browser) {
    const result = await browser.executeAsyncScript(
      function (arg1: string, arg2: number, done: (arg: string) => void) {
        return 'nightwatch';
      },
      ['js', 1]
    );
    expectType<string>(result);

    const result1 = await browser.executeAsyncScript(function (done: () => void) {
      return 'nightwatch';
    });
    expectType<unknown>(result1)

    const result2 = await browser.executeAsyncScript(function () {});
    expectType<unknown>(result2)

    const result3 = await browser.executeAsyncScript(
      function (arg1: number, done) {
        return 'nightwatch';
      },
      [2]
    );
    expectType<unknown>(result3)

    expectError(await browser.executeAsyncScript(function (arg1: string) {
      return 'nightwatch';
    }))

    expectError(await browser.executeAsyncScript(
      function (arg1: string, done: (result: string) => void) {
        return 'nightwatch';
      },
      [123]
    ))

    expectError(await browser.executeAsyncScript(
      function (arg1: string, done) {
        return 'nightwatch';
      },
      ['js', 123]
    ))

    const result4 = await browser.executeAsyncScript('something');
    expectType<unknown>(result4)

    const result5 = await browser.executeAsyncScript('something', ['something', 5]);
    expectType<unknown>(result5)
  });

  after((browser) => browser.end());
});

//
// .executeAsync
//
describe('executeAsync command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', async function (browser) {
    const result = await browser.executeAsync(
      function (arg1: string, arg2: number, done: (arg: string) => void) {
        return 'nightwatch';
      },
      ['js', 1]
    );
    expectType<string>(result);

    const result1 = await browser.executeAsync(function (done: () => void) {
      return 'nightwatch';
    });
    expectType<unknown>(result1)

    const result2 = await browser.executeAsync(function () {});
    expectType<unknown>(result2)

    const result3 = await browser.executeAsync(
      function (arg1: number, done) {
        return 'nightwatch';
      },
      [2]
    );
    expectType<unknown>(result3)

    expectError(await browser.executeAsync(function (arg1: string) {
      return 'nightwatch';
    }))

    expectError(await browser.executeAsync(
      function (arg1: string, done: (result: string) => void) {
        return 'nightwatch';
      },
      [123]
    ))

    expectError(await browser.executeAsync(
      function (arg1: string, done) {
        return 'nightwatch';
      },
      ['js', 123]
    ))

    const result4 = await browser.executeAsync('something');
    expectType<unknown>(result4)

    const result5 = await browser.executeAsync('something', ['something', 5]);
    expectType<unknown>(result5)
  });

  after((browser) => browser.end());
});
