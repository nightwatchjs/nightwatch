import { expectType } from 'tsd';
import { JSON_WEB_OBJECT, NightwatchSizeAndPosition, ElementResult, NightwatchAPI, NightwatchCallbackResult, ElementGlobal } from '..';

//
// .clearValue
//
describe('clearValue Command demo', function () {
  test('demo test', function () {
    browser
      .url('https://google.com')
      .waitForElementVisible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch.js')
      .clearValue('input[type=text]', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      })
      .expect.element('input[type=text]')
      .text.to.equal('');
  });

  test('async demo test', async function (browser) {
    const result = await browser
      .url('https://google.com')
      .waitForElementVisible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch.js')
      .clearValue('input[type=text]');
    expectType<null>(result);
  });
});

//
// .click
//
describe('click Command demo', function () {
  test('demo test', function () {
    browser
      .url('https://google.com')
      .waitForElementVisible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch.js')
      .click('input[type=submit]', function (result) {
        expectType<NightwatchAPI>(this);
        expectType<NightwatchCallbackResult<null>>(result);
      });
  });

  test('async demo test', async function (browser) {
    const result = await browser
      .url('https://google.com')
      .waitForElementVisible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch.js')
      .click('input[type=submit]');
    expectType<null>(result);
  });
});

//
// .getAttribute
//
describe('getAttribute command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function () {
    browser.getAttribute('input[type=text]', 'title', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string | null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getAttribute('input[type=text]', 'title');
    expectType<string | null>(result);
  });

  after((browser) => browser.end());
});

//
// .getCssProperty
//
describe('getCssProperty command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function () {
    browser.getCssProperty('input[type=text]', 'background-color', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getCssProperty('input[type=text]', 'background-color');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .getElementSize
//
describe('getElementSize command demo', function () {
  test('demo test', function () {
    browser.url('https://www.ecosia.org/').getElementSize('#navbartop', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<NightwatchSizeAndPosition>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.url('https://www.ecosia.org/').getElementSize('#__nuxt');
    expectType<NightwatchSizeAndPosition>(result);
  });
});

//
// .getLocation
//
describe('getLocation command demo', function () {
  test('demo test', function () {
    browser.url('https://www.ecosia.org/').getLocation('#__nuxt', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<NightwatchSizeAndPosition>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.url('https://www.ecosia.org/').getLocation('#__nuxt');
    expectType<NightwatchSizeAndPosition>(result);
  });
});

//
// .getTagName
//
describe('getTagName command demo', function () {
  before((browser) => browser.url('https://www.ecosia.org/'));

  test('demo test', function () {
    browser.getTagName('#__nuxt', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getTagName('#__nuxt');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .getText
//
describe('getText command demo', function () {
  before((browser) => browser.url('https://nightwatchjs.org/'));

  test('demo test', function () {
    browser.getText('#top-section', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getText('#top-section');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .getValue
//
describe('getValue command demo', function () {
  before((browser) => browser.url('https://google.com/'));

  test('demo test', function () {
    browser.setValue('input[type=text]', 'nightwatchjs').getValue('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getValue('input[type=text]');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .getShadowRoot
//
describe('getShadowRoot command demo', function () {
  test('demo test', function () {
    browser.getShadowRoot('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<ElementGlobal | null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getShadowRoot('input[type=text]');
    expectType<ElementGlobal | null>(result);

    const result2 = await browser.getShadowRoot(await element('selector').getWebElement());
    expectType<ElementGlobal | null>(result2);
  });
});

//
// .isVisible
//
describe('isVisible command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.isVisible('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.isVisible('input[type=text]');
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .isPresent
//
describe('isPresent command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.isPresent('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.isPresent('input[type=text]');
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .setValue
//
describe('setValue command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.setValue('input[type=text]', 'nightwatchjs', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.setValue('input[type=text]', 'nightwatchjs');
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .sendKeys
//
describe('sendKeys command demo', function () {
  before((browser) => browser.url('https://google.com/'));

  test('demo test', function () {
    browser.sendKeys('input[type=text]', 'nightwatchjs', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.setValue('input[type=text]', ['nightwatchjs', browser.Keys.ENTER]);
    expectType<null>(result);
  });
  after((browser) => browser.end());
});

//
// .setPassword
//
describe('setPassword command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.setPassword('input[type=text]', 'nightwatchjs', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.setPassword('input[type=text]', ['nightwatchjs', browser.Keys.ENTER]);
    expectType<null>(result);
  });

  after((browser) => browser.end());
});

//
// .setAttribute
//
describe('setAttribute command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.setAttribute('input[type=text]', 'disabled', 'true', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.setAttribute('input[type=text]', 'disabled', 'false');
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .isEnabled
//
describe('isEnabled command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.setAttribute('input[type=text]', 'disabled', 'true').isEnabled('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.isEnabled('input[type=text]');
    expectType<boolean>(result);
  });

  after((browser) => browser.end());
});

//
// .getElementProperty
//
describe('getElementProperty command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.getElementProperty('input[type=text]', 'disabled', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<any>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getElementProperty('input[type=text]', 'disabled');
    expectType<any>(result);
  });

  after((browser) => browser.end());
});

//
// .findElement
//
describe('findElement command demo', function () {
  before((browser) => browser.url('https://google.com/'));
  test('demo test', function () {
    browser.findElement('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<JSON_WEB_OBJECT>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.findElement('input[type=text]');
    expectType<JSON_WEB_OBJECT>(result);
  });

  after((browser) => browser.end());
});

//
// .getElementRect
//
describe('getElementRect command demo', function () {
  before((browser) => browser.url('https://www.ecosia.org/'));

  test('demo test', function () {
    browser.getElementRect('#__nuxt', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<NightwatchSizeAndPosition>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getElementRect('#__nuxt');
    expectType<NightwatchSizeAndPosition>(result);
  });

  after((browser) => browser.end());
});

//
// getAriaRole
//
describe('getAriaRole command demo', function () {
  before((browser) => browser.url('https://www.ecosia.org/'));

  test('demo test', function () {
    browser.getAriaRole('#__nuxt', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getAriaRole('#__nuxt');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// .getAccessibleName
//
describe('getAccessibleName command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function () {
    browser.getAccessibleName('input[type=text]', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.getAccessibleName('input[type=text]');
    expectType<string>(result);
  });

  after((browser) => browser.end());
});

//
// waitForElementVisible
//
describe('waitForElementVisible command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function () {
    browser.waitForElementVisible('input[type=text]', undefined, undefined, true, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.waitForElementVisible('input[type=text]', undefined, undefined, true);
    expectType<true | Error>(result);
  });

  after((browser) => browser.end());
});

//
// .waitForElementPresent
//
describe('waitForElementPresent command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('demo test', function () {
    browser.waitForElementPresent('input[type=text]', undefined, undefined, undefined, function (result) {
      expectType<NightwatchAPI>(this);

      expectType<NightwatchCallbackResult<null | ElementResult[]>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.waitForElementPresent('input[type=text]');
    expectType<ElementResult[] | Error>(result);
  });

  after((browser) => browser.end());
});

//
// .dragAndDrop
//
describe('dragAndDrop command demo', function () {
  before((browser) => browser.url('https://www.google.com/'));

  test('hello', function () {
    browser.dragAndDrop('input[type=text]', { x: 50, y: 50 }, function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    });
  });

  test('async demo test', async function (browser) {
    const result = await browser.dragAndDrop('input[type=text]', { x: 50, y: 50 });
    expectType<null>(result);
  });

  after((browser) => browser.end());
});
