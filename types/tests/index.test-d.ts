import { expectAssignable, expectError, expectNotType, expectType } from 'tsd';
import { EventEmitter } from 'events';
import {
  EnhancedPageObject,
  EnhancedSectionInstance,
  NightwatchAPI,
  NightwatchAssertion,
  NightwatchAssertionsResult,
  NightwatchBrowser,
  NightwatchClient,
  NightwatchClientObject,
  NightwatchEnsureResult,
  NightwatchNodeAssertionsResult,
  NightwatchTests,
  PageObjectModel,
  ELEMENT_KEY,
  JSON_WEB_OBJECT,
  ElementResult,
  Awaitable,
  SectionProperties,
  ScopedElement,
  LocateStrategy
} from '..';
import { element as elementNamedExport } from '..';
import { WebElement } from 'selenium-webdriver';

function isNightwatchAssertionsResult<T>(result: NightwatchAssertionsResult<T>): T {
  return result.value;
}

//
// ./tests/general.ts
//

const testGeneral: NightwatchTests = {
  'Demo test Google 1': () => {
    browser.registerBasicAuth('test-username', 'test-password').navigateTo('https://google.com').pause(1000);

    // check types on browser.options
    expectType<string | string[] | undefined>(browser.options.tag_filter);
    // expect element <body> to be present in 1000ms
    browser.expect.element('body').to.be.present.before(1000);

    // expect element <#lst-ib> to have css property 'display'
    browser.expect.element('#lst-ib').to.have.css('display');

    // expect element <body> to have attribute 'class' which contains text 'vasq'
    browser.expect.element('body').to.have.attribute('class').which.contains('vasq');

    browser.expect.element('#hplogo').to.have.attribute('alt').which.startsWith('G').and.endsWith('oogle');

    // expect element <#lst-ib> to be an input tag
    browser.expect.element('#lst-ib').to.be.an('input');

    // expect element <#lst-ib> to be visible
    browser.expect.element('#lst-ib').to.be.visible;

    browser.end();
  },

  'Demo test Google 2': () => {
    browser
      .url('https://www.google.com')
      .waitForElementVisible('body')
      .setValue('input[type=text]', 'nightwatch')
      .getElementRect('input[type=text]', (res) => {
        console.log(res.value);
      })
      .waitForElementVisible('input[name=btnK]')
      .click('input[name=btnK]')
      .pause(1000)
      .assert.containsText('#main', 'Night Watch')
      .end();
  },

  'Demo Nightwatch API commands': () => {
    expectType<boolean>(browser.isChrome());
    expectType<boolean>(browser.isAndroid());
    expectType<boolean>(browser.isMobile());
    expectType<boolean>(browser.isAppiumClient());

    const element_id = browser.WEBDRIVER_ELEMENT_ID;
    console.log(element_id);
    const browserName = browser.browserName;
    console.log(browserName);
    expectError(() => {
      browser.WEBDRIVER_ELEMENT_ID = 'some-element-id';
    })

    expectError(() => {
      browser.browserName = 'firefox';
    })

    expectError(browser.element('css selector', 'something', function (result) {
      if (result.status === 0) {
        console.log(result.value);
      }
    }));

    browser.elements('css selector', 'something', function (result) {
      if (result.status === 0) {
        expectType<string>(result.value[0][ELEMENT_KEY]);
      }
      expectType<NightwatchAPI>(this);
    });
  },

  'Demo Nightwatch API commands with async/await': async () => {
    // backward compatibility to some extent
    const element = await browser.element('css selector', 'something');
    expectType<WebElement>(element);

    const elements = await browser.elements('css selector', 'something');
    expectType<string>(elements[0][ELEMENT_KEY]);

    // new element api
    const elem = elementNamedExport('selector');
    expectType<ScopedElement>(elem);
    expectType<WebElement>(await elem);

    const childChildEle = await elementNamedExport.find('selector').findAll('child-selector').nth(2).find('child-child-selector');
    expectType<WebElement>(childChildEle);
  },

  'Can run accessibility tests': () => {
    browser
      .url('https://nightwatchjs.org')
      .axeInject()
      .axeRun(['#navBar', 'nav'], {
        rules: {
          'color-contrast': { enabled: false },
          region: { enabled: false }
        },
      }, (result) => {
        if (result.status === 0) {
          expectType<{[key: string]: any}>(result.value);
        }
      });
  },

  'step one: navigate to google': () => {
    browser
      .url('https://www.google.com')
      .waitForElementVisible('body', 1000)
      .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('input[name=btnK]', 1000);
  },

  'step two: click input': () => {
    browser.click('input[name=btnK]').pause(1000).assert.containsText('#main', 'Night Watch').end();
  },

  'test user defined globals': () => {
    browser.url(`http://${browser.globals.username}:${browser.globals.password}@example.com`).end();
  },

  'Demo test for built-in API commands for working with the Chrome Devtools Protocol': () => {
    // setGeolocation
    browser
      // Set location of Tokyo, Japan
      .setGeolocation({
        latitude: 35.689487,
        longitude: 139.691706,
        accuracy: 100,
      })
      .captureNetworkRequests((requestParams) => {
        console.log('Request URL:', requestParams.request.url);
        console.log('Request method:', requestParams.request.method);
        console.log('Request headers:', requestParams.request.headers);
      })
      .navigateTo('https://www.gps-coordinates.net/my-location')
      .end();

    browser
      .mockNetworkResponse(
        'https://www.google.com/',
        {
          status: 200,
          headers: {
            'Content-Type': 'UTF-8',
          },
          body: 'Hello there!',
        },
        (res) => {
          console.log(res);
        }
      )
      .setDeviceDimensions({
        width: 400,
        height: 600,
        deviceScaleFactor: 50,
        mobile: true,
      })
      .navigateTo('https://www.google.com')
      .end();

    browser
      .enablePerformanceMetrics()
      .navigateTo('https://www.google.com')
      .getPerformanceMetrics((metrics) => {
        console.log(metrics);
      });

    browser.navigateTo('https://www.google.com').takeHeapSnapshot('./snap.heapsnapshot').end();

    browser
      .captureBrowserConsoleLogs((event) => {
        console.log(event.type, event.timestamp, event.args[0].value);
      })
      .navigateTo(browser.baseUrl)
      .executeScript(() => {
        console.error('here');
      }, []);
  },
  'test assert with async/await': async () => {
    const attributeResult = browser.assert.attributeContains('input[name=q]', 'placeholder', 'Search');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>>(attributeResult);
    isNightwatchAssertionsResult<string>(await attributeResult);

    const cssPropertyResult = browser.assert.cssProperty('input[name=q]', 'classList', 'searchbox');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>>(cssPropertyResult);
    isNightwatchAssertionsResult<string | number>(await cssPropertyResult);

    const domPropertyResult = browser.assert.domPropertyContains('input[name=q]', 'classList', 'searchbox');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<any>>>(domPropertyResult);
    isNightwatchAssertionsResult<any>(await domPropertyResult);

    const elementsCountResult = browser.assert.elementsCount('input', 8);
    expectType<
      Awaitable<
        NightwatchAPI,
        NightwatchAssertionsResult<JSON_WEB_OBJECT[]> & {
          WebdriverElementId: string;
        }
      >
    >(elementsCountResult);
    const elementsCountAwaitedResult = await elementsCountResult;
    expectType<JSON_WEB_OBJECT[]>(elementsCountAwaitedResult.value);
    expectType<string>(elementsCountAwaitedResult.WebdriverElementId);

    const elementPresentResult = browser.assert.elementPresent('input');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<ElementResult[]>>>(elementPresentResult);
    isNightwatchAssertionsResult<Array<{ [ELEMENT_KEY]: string }>>(await elementPresentResult);

    const hasAttributeResult = browser.assert.hasAttribute('input[name=q]', 'placeholder');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>>(hasAttributeResult);
    isNightwatchAssertionsResult<string>(await hasAttributeResult);

    const selectedResult = browser.assert.selected('input[name=q]');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<boolean>>>(selectedResult);
    isNightwatchAssertionsResult<boolean>(await selectedResult);

    const textResult = browser.assert.textMatches('input[name=q]', /^Search/);
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>>(textResult);
    isNightwatchAssertionsResult<string>(await textResult);

    const urlResult = browser.assert.urlMatches('https://nightwatch.org');
    expectType<Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>>(urlResult);
    isNightwatchAssertionsResult<string>(await urlResult);
  },
  'test node assertions with async/await': async () => {
    const result = browser.assert.strictEqual('nightwatch', 'nightwatch');
    expectType<Awaitable<NightwatchAPI, Error | NightwatchNodeAssertionsResult>>(result);
    expectType<NightwatchNodeAssertionsResult | Error>(await result);
  },
};

//
// ./tests/duckDuckGo.ts
//
describe('duckduckgo example', function () {
  it('Search Nightwatch.js and check results', function (browser) {
    browser
      .navigateTo('https://duckduckgo.com')
      .waitForElementVisible('input[name=q]')
      .sendKeys('input[name=q]', ['Nightwatch.js'])
      .click('*[type="submit"]')
      .assert.visible('.results--main')
      .assert.textContains('.results--main', 'Nightwatch.js');
  });
});

//
// .tests/native/wikipedia.ts
//
const wikipediaAppTest: NightwatchTests = {
  before: (client: NightwatchBrowser) => {
    client.click(by.xpath('//XCUIElementTypeButton[@name="Skip"]'));
  },

  after: (client: NightwatchAPI) => {
    client.end();
  },

  'Search for BrowserStack': async (client: NightwatchAPI) => {
    client
      .useXpath()
      .click('//XCUIElementTypeSearchField[@name="Search Wikipedia"]')
      .getOrientation(function (result) {
        if (result.status === 0) {
          expectType<'LANDSCAPE' | 'PORTRAIT'>(result.value);
        }
        expectType<NightwatchAPI>(this);
      })
      .setOrientation('LANDSCAPE', function (result) {
        if (result.status === 0) {
          expectType<'LANDSCAPE' | 'PORTRAIT'>(result.value);
        }
        expectType<NightwatchAPI>(this);
      })
      .appium.pressKeyCode(13, 44)
      .sendKeys('//XCUIElementTypeSearchField[@name="Search Wikipedia"]', 'browserstack')
      .click('//XCUIElementTypeStaticText[@name="BrowserStack"]')
      .waitUntil(async function () {
        // wait for webview context to be available
        const contexts = await this.appium.getContexts(function (result) {
          if (result.status === 0) {
            expectType<string[]>(result.value);
          }
          expectType<NightwatchAPI>(this);
        });

        return contexts.length > 1;
      }, 50000)
      .perform(async function () {
        // switch to webview context
        const contexts = await this.contexts();
        const setContextResult = await this.setContext(contexts[1], function (result) {
          if (result.status === 0) {
            expectType<null>(result.value);
          }
          expectType<NightwatchAPI>(this);
        });

        const currContext = await this.currentContext(function (result) {
          if (result.status === 0) {
            expectType<string | null>(result.value);
          }
          expectType<NightwatchAPI>(this);
        });

        expectType<string[]>(contexts);
        expectType<null>(setContextResult);
        expectType<string | null>(currContext);

        // switch orientation back to portrait
        const currOrientation = await client.getOrientation();
        const setOrientationResult = await client.setOrientation('PORTRAIT');

        expectType<'LANDSCAPE' | 'PORTRAIT'>(currOrientation);
        expectType<'LANDSCAPE' | 'PORTRAIT'>(setOrientationResult);
      })
      .useCss()
      .assert.textEquals('.pcs-edit-section-title', 'BrowserStack'); // command run in webview context
  },
};

//
// ./pages/google.ts
//

const appsSection = {
  selector: 'div.gb_qc',
  commands: {
    clickYoutube(this: EnhancedSectionInstance) {
      return this.click('@youtube');
    },
    something(this: EnhancedSectionInstance) {
      return this.click('@youtube');
    },
  },
  elements: [{
    myAccount: '#gb192'
  },
  {
    youtube: {
      selector: '#gb36',
    },
  }]
} satisfies SectionProperties;

const menuSection = {
  selector: '#gb',
  locateStrategy: 'css selector',
  commands: [
    {
      // add section commands here
      clickApps(this: EnhancedSectionInstance) {
        return this.click('@appSection');
      },

      randomCommand(this: EnhancedSectionInstance) {
        return this.click('@appSection');
      },
    },
    {
      doSomething(this: EnhancedSectionInstance) {
        return this.click('@appSection');
      },
    },
  ],
  elements: {
    mail: 'a[href="mail"]',
    images: {
      selector: 'a[href="imghp"]',
    },
  },
  sections: {
    apps: appsSection,
  },
} satisfies SectionProperties;

const googleCommands = {
  submit(this: GooglePage) {
    this.api.pause(1000);
    return this.waitForElementVisible('@submitButton', 1000)
      .click('@submitButton')
      .waitForElementNotPresent('@submitButton');
  },
};

const googlePage = {
  commands: [googleCommands],
  elements: {
    searchBar: 'input[type=text]',
    submitButton: {
      selector: 'input[name=btnK]',
      locateStrategy: 'css selector'
    },
  },
  sections: {
    menu: menuSection,
  },
} satisfies PageObjectModel;

// export = googlePage;

// const iFrameCommands = {
//   url(this: EnhancedPageObject) {
//     return `${this.api.launch_url}/iframe`;
//   },
// }

const iFrame = {
  elements: [{
    iframe: '#mce_0_ifr',
    hey: undefined
  },
  {
    textbox: {
      selector: 'body#tinymce p',
    }
  }],
  commands: {
    url(this: EnhancedPageObject) {
      return `${this.api.launch_url}/iframe`;
    },
  },
} satisfies PageObjectModel;

// export = iFrame

interface GooglePage
  extends EnhancedPageObject<
    typeof googleCommands,
    typeof googlePage.elements,
    typeof googlePage.sections
  > {}

interface iFramePage extends EnhancedPageObject<typeof iFrame.commands, typeof iFrame.elements> {}

declare module '..' {
  interface NightwatchCustomPageObjects {
    google(): GooglePage;
    IFrame(): iFramePage;
  }
}

// TODO: fix Page Object types
const testPage = {
  'Test commands': () => {
    const google = browser.page.google();
    google.setValue('@searchBar', 'nightwatch').submit().assert.titleContains('nightwatch');

    expectType<NightwatchAPI>(google.api);
    expectType<NightwatchClient>(google.client);

    const result = google
      .setValue('@searchBar', 'nightwatch')
      .assert.titleContains('Google');
    
    expectAssignable<GooglePage>(result);
    expectAssignable<GooglePage>(result.submit());
    expectAssignable<GooglePage>(result.cookies.getAll());

    // test new element api
    google.element('@searchBar');
    google.element.findAll('@searchBar');

    browser.end();
  },

  'Test sections': () => {
    const google = browser.page.google();

    expectAssignable<GooglePage>(google.cookies.deleteAll());
    expectError(googlePage.window.maximize());

    const menuSection = google.section.menu;

    expectType<string>(menuSection.selector);
    expectType<LocateStrategy>(menuSection.locateStrategy);

    google.expect.section('@menu').to.be.visible;
    google.expect.section(menuSection).to.be.visible;

    const result = menuSection
      .assert.visible('@mail')
      .assert.visible('@images');

    expectAssignable<typeof menuSection>(result);

    menuSection.expect.element('@mail').to.be.visible;
    menuSection.expect.element('@images').to.be.visible;

    expectAssignable<typeof menuSection>(menuSection.alerts.accept());
    expectType<NightwatchAPI>(menuSection.api);
    expectType<NightwatchClient>(menuSection.client);

    menuSection.selector;

    expectNotType<any>(menuSection.clickApps());

    const imagesElement = menuSection.elements.images;
    expectNotType<any>(imagesElement);

    const appSection = menuSection.section.apps;
    appSection.expect.element('@myAccount').to.be.visible;
    appSection.expect.element('@youtube').to.be.visible;

    const youtubeElement = appSection.elements.youtube;
    expectNotType<any>(youtubeElement);

    // test new element api
    menuSection.element('@main');
    menuSection.element.findAll('@main').nth(1).find('@images');

    expectNotType<any>(appSection.clickYoutube());

    browser.end();
  },

  'Test assertions on page': () => {
    const google: GooglePage = browser.page.google();

    google
      .navigate()
      .assert.title('Google') // deprecated
      .assert.titleEquals('Google') // new in 2.0
      .assert.visible('@searchBar')
      .assert.strictEqual('Google', 'Google') // node assertion returning NightwatchAPI
      .assert.not.titleContains('DuckDuckGo')
      .moveToElement('@searchBar', 1, 1)
      .setValue('@searchBar', 'nightwatch')
      .click('@submit');

    expectError(google.assert.not.not.elementPresent('@searchbar'))
    expectError(google.assert.not.strictEqual('nightwatch', 'nightwatch'))

    browser.end();
  },

  'Test iFrame on page': async () => {
    const iFrame = browser.page.IFrame();
    iFrame.navigate();
    const frame = await browser.findElement(iFrame.elements.iframe);
    console.log(frame.getId());
    browser.frame(frame.getId());
    iFrame.expect.element('@textbox').text.to.equal('Your content goes here.');

    browser.end();
  },

  'Test passing CSS selector string to frame': () => {
    const iFrame = browser.page.IFrame();
    iFrame.navigate().waitForElementPresent('#mce_0_ifr', 10000);
    browser.frame('#mce_0_ifr');
    iFrame.expect.element('@textbox').text.to.equal('Your content goes here.');
    browser.end();
  },

  'Test nested page objects': () => {
    const google = browser.page.subfolder1.subfolder2.subfolder3.google();
  },
};

//
// ./tests/specific-commands.ts
//

const testSpecificCommands: NightwatchTests = {
  executeAsync: () => {
    browser.executeAsync(
      (done) => {
        setTimeout(() => {
          done(true);
        }, 500);
      },
      [],
      (result) => {
        browser.assert.equal(result.value, true);
      }
    );

    browser.executeAsync(
      (arg1: number, arg2: string, done: (result: true) => void) => {
        setTimeout(() => {
          done(true);
        }, 500);
      },
      [1, '2'],
      (result) => {
        browser.assert.equal(result.value, true);
      }
    );

    browser.end();
  },

  executeAsyncScript: () => {
    browser.executeAsyncScript(
      (done) => {
        setTimeout(() => {
          done(true);
        }, 500);
      },
      [],
      (result) => {
        browser.assert.equal(result.value, true);
      }
    );

    browser.executeAsyncScript(
      (arg1: number, arg2: number, done: (result: boolean) => void) => {
        setTimeout(() => {
          done(true);
        }, 500);
      },
      [1, 2],
      (result) => {
        browser.assert.equal(result.value, true);
      }
    );

    browser.end();
  },
};

//
// ./commands/localStorageValue.ts
// - function based command
//

function localStorageValueCommand(this: NightwatchAPI, key: string, callback?: (value: string | null) => void) {
  const self = this;

  this.execute(
    // tslint:disable-next-line:only-arrow-functions
    function (key) {
      return window.localStorage.getItem(key);
    },
    [key], // arguments array to be passed
    (result) => {
      if (result.status) {
        throw result.value;
      }
      if (typeof callback === 'function') {
        callback.call(self, result.value);
      }
    }
  );

  return this;
}

declare module '..' {
  interface NightwatchCustomCommands {
    localStorageValue(key: string, callback?: (value: string | null) => void): this;
  }
}

// module.exports.command = resizeCommand;

const testCustomCommandFunction = {
  'Test command function': () => {
    browser.localStorageValue('my-key', (result) => {
      console.log(result);
    });
  },
};

//
// ./commands/consoleLog.ts
// - class based command
//

class ConsoleLog extends EventEmitter {
  command(this: ConsoleLog & NightwatchAPI, message: string, ...args: any[]) {
    setTimeout(() => {
      console.log(message, ...args);
      this.emit('complete');
    }, 1);

    return this;
  }
}

declare module '..' {
  interface NightwatchCustomCommands {
    consoleLog(message: string, ...args: any[]): this;
  }
}

// module.exports = ConsoleLog;

const testCustomCommandClass = {
  'Test command class': () => {
    browser.consoleLog('Hello world!');
  },
};

//
// ./assertions/text.ts
//

function text(this: NightwatchAssertion<string>, selector: string, expectedText: string, msg?: string) {
  this.expected = expectedText;

  this.message = msg || `Element <${selector}> has text ${this.expected}.`;

  this.pass = (value) => value === expectedText;

  this.value = (result) => result.value!;

  this.command = function (callback) {
    this.api.findElement('css selector', selector, (elementResult) => {
      if (elementResult.status === 0) {
        this.api.elementIdText(elementResult.value[ELEMENT_KEY as keyof ElementResult], (textResult) => {
          callback({ value: textResult.value as string });
        });
      }
    });
    return this;
  };

  expectType<NightwatchClientObject>(this.client);
}

// exports.assertion = text;

declare module '..' {
  interface NightwatchCustomAssertions<ReturnType> {
    text: (selector: string, expectedText: string, msg?: string) => NightwatchAPI;
  }
}

const testCustomAssertion = {
  'Test custom assertion': () => {
    browser.assert.text('#checkme', 'Exactly match text');
  },
};

// test global element

describe('demo element() global', () => {
  const signupEl = element(by.css('#signupSection'));
  const loginEl = element('#weblogin');

  test('element globals command', async () => {
    // use elements created with element() to regular nightwatch assertions
    browser.assert.visible(loginEl);

    // use elements created with element() to expect assertions
    browser.expect.element(loginEl).to.be.visible;

    // retrieve the WebElement instance
    const loginWebElement = await loginEl.getWebElement();
  });
});

// Ensure test

it('Ensure demo test', () => {
  browser
    .url('https://nightwatchjs.org')
    .ensure.titleMatches(/Nightwatch.js/)
    .ensure.elementIsVisible('#index-container');
});

it('Ensure async/await demo test', async () => {
  const result = await browser
    .url('https://nightwatchjs.org')
    .ensure.urlContains('nightwatch')
    .ensure.titleMatches(/Nightwatch.js/)
    .ensure.elementIsVisible('#index-container');

  function isNightwatchEnsureResult(v: NightwatchEnsureResult) {}
  function isNull(v: null) {}

  isNightwatchEnsureResult(result);
  isNull(result.value);
});

// chai expect test

it('Chai demo test', () => {
  const infoElement = element('.info');
  expect(infoElement.property('innerHTML')).to.be.a('string').and.to.include('validation code');
});

// Relative locator test
// Describe not working
describe('sample with relative locators', () => {
  before((browser) => browser.navigateTo('https://archive.org/account/login'));

  it('locates password input', () => {
    const passwordElement = locateWith(By.tagName('input')).below(By.css('input[type=email]'));

    browser.waitForElementVisible(passwordElement).expect.element(passwordElement).to.be.an('input');

    browser.expect.element(passwordElement).attribute('type').equal('password');
  });
});
