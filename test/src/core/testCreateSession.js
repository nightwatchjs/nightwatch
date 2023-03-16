const assert = require('assert');
const nock = require('nock');
const path = require('path');
const Nocks = require('../../lib/nocks.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test Request With Credentials', function () {
  beforeEach(function () {
    Nocks.cleanAll();
    try {
      Nocks.enable();
    } catch (e) {
    }

  });

  afterEach(function () {
    Nocks.deleteSession();
  });

  after(function () {
    Nocks.disable();
  });

  it('Test create session in Firefox', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'firefox',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false
    });

    const result = await client.createSession();
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'firefox'
    });
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'firefox', version: 'TEST', platform: 'TEST'}
    });
  });

  it('Test create session in Chrome', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'chrome',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });

    const result = await client.createSession();
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'chrome'
    });
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        browserName: 'chrome', version: 'TEST', platform: 'TEST'
      }
    });
  });

  it('Test create session in Edge', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'MicrosoftEdge',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      }
    });

    const result = await client.createSession();
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'MicrosoftEdge'
    });
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        browserName: 'MicrosoftEdge', version: 'TEST', platform: 'TEST'
      }
    });
  });

  it('Test create session with headless mode in Firefox', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'firefox',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false
    });

    let sessionOptions;
    const driverFn = client.transport.createDriver;
    client.transport.createDriver = function({options}) {
      sessionOptions = options;

      return driverFn.call(client.transport, {options});
    };

    const session = await client.createSession({
      argv: {
        headless: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'firefox', version: 'TEST', platform: 'TEST'}
    });
    assert.deepStrictEqual(sessionOptions.get('moz:firefoxOptions'), {args: ['-headless']});
  });

  it('Test create session with headless mode in Chrome', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'chrome',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });

    let sessionOptions;
    const driverFn = client.transport.createDriver;
    client.transport.createDriver = function({options}) {
      sessionOptions = options;

      return driverFn.call(client.transport, {options});
    };

    const session = await client.createSession({
      argv: {
        headless: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'chrome', version: 'TEST', platform: 'TEST'}
    });
    assert.deepStrictEqual(sessionOptions.get('goog:chromeOptions'), {args: ['headless=new']});
  });

  it('Test create session with headless mode in Edge', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'MicrosoftEdge',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      }
    });

    let sessionOptions;
    const driverFn = client.transport.createDriver;
    client.transport.createDriver = function({options}) {
      sessionOptions = options;

      return driverFn.call(client.transport, {options});
    };

    const session = await client.createSession({
      argv: {
        headless: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'MicrosoftEdge', version: 'TEST', platform: 'TEST'}
    });

    assert.deepStrictEqual(sessionOptions.get('ms:edgeOptions'), {args: ['headless']});
  });

  it('Test create session with headless mode in Chrome with existing args', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'chrome',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--no-sandbox']
        }
      }
    });

    let sessionOptions;
    const driverFn = client.transport.createDriver;
    client.transport.createDriver = function({options}) {
      sessionOptions = options;

      return driverFn.call(client.transport, {options});
    };

    const session = await client.createSession({
      argv: {
        headless: true
      }
    });

    assert.deepStrictEqual(sessionOptions.get('goog:chromeOptions'), {
      args: [
        '--no-sandbox',
        'headless=new'
      ]
    });
  });

  it('Test create session with headless mode in Edge with existing args', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'MicrosoftEdge',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          args: ['--no-sandbox']
        }
      }
    });

    let sessionOptions;
    const driverFn = client.transport.createDriver;
    client.transport.createDriver = function({options}) {
      sessionOptions = options;

      return driverFn.call(client.transport, {options});
    };

    const session = await client.createSession({
      argv: {
        headless: true
      }
    });

    assert.deepStrictEqual(sessionOptions.get('ms:edgeOptions'), {
      args: [
        '--no-sandbox',
        'headless'
      ]
    });
  });

  it('Test blank object capabilities', async function () {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'chrome',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    const client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'chrome'
      },
      capabilities: {}
    });

    const result = await client.createSession();
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'chrome'
    });
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        browserName: 'chrome', version: 'TEST', platform: 'TEST'
      }
    });
  });

  it('Test blank browserName', async function () {
    assert.throws(function() {
      const client = Nightwatch.createClient({
        selenium_port: 10195,
        silent: false,
        output: false,
        desiredCapabilities: {},
        capabilities: {
          alwaysMatch: {}
        }
      });
    }, /Error: Unknown browser:/);
  });

  it('Test create session with browsername null - Appium support', async function () {
    nock('http://localhost:4723')
      .post('/wd/hub/session')
      .reply(201, {
        value: {
          capabilities: {
            platformName: 'iOS',
            platformVersion: '15.5',
            deviceName: 'iPhone 13',
            name: 'sample test goes here'
          },
          sessionId: '1352110219202'
        }
      });

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        start_process: false,
        host: 'localhost',
        port: '4723'
      },
      desiredCapabilities: {
        browserName: null,
        platformName: 'iOS',
        platformVersion: '15.5',
        deviceName: 'iPhone 13'
      }
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      capabilities: {
        platformName: 'iOS',
        platformVersion: '15.5',
        deviceName: 'iPhone 13',
        name: 'sample test goes here'
      },
      sessionId: '1352110219202'
    });
  });

  it('Test create session with use_appium property and random browser - Appium support', async function () {
    nock('http://somewhere:9999')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        assert.deepEqual(requestBody, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              browserName: 'acmeBrowser',
              platformName: 'android',
              'appium:platformVersion': '12.0'
            }
          }
        });

        return {
          value: {
            capabilities: {
              browserName: 'acmeBrowser',
              platformName: 'android',
              platformVersion: '12.0',
              name: 'sample test goes here'
            },
            sessionId: '1352110219202'
          }
        };
      });

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        start_process: false,
        use_appium: true,
        host: 'somewhere',
        port: 9999
      },
      desiredCapabilities: {
        browserName: 'acmeBrowser',
        platformName: 'android',
        'appium:platformVersion': '12.0'
      }
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      capabilities: {
        browserName: 'acmeBrowser',
        platformName: 'android',
        platformVersion: '12.0',
        name: 'sample test goes here'
      },
      sessionId: '1352110219202'
    });
  });

  it('Test create session with browserstack', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {

        assert.deepEqual(requestBody, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              browserName: 'chrome',
              'bstack:options': {
                local: 'false',
                sessionName: 'Try 1',
                userName: 'test_user',
                accessKey: 'test_key',
                os: 'OS X',
                osVersion: 'Monterey',
                buildName: 'Nightwatch Programmatic Api Demo'
              },
              'goog:chromeOptions': {
                w3c: false
              }
            }
          }
        });

        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'WIN_CHROME_PROD_SANITY_LIVE_1831',
            duration: 47,
            status: 'running',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasds',
            build_tag: null
          }
        },
        {
          automation_build: {
            name: 'External monitoring - aps - 2022-08-30',
            duration: 44,
            status: 'done',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasdk',
            build_tag: null
          }
        }
      ]);

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        host: 'hub.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'bstack:options': {
          local: 'false',
          userName: 'test_user',
          accessKey: 'test_key',
          os: 'OS X',
          osVersion: 'Monterey'
        },
        browserName: 'chrome',
        chromeOptions: {
          w3c: false
        }
      },

      parallel: false
    });

    client.mergeCapabilities({
      name: 'Try 1',
      build: 'Nightwatch Programmatic Api Demo'
    });

    const result = await client.createSession();
    assert.deepEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: {
          browserName: 'chrome',
          'bstack:options': {
            local: 'false',
            sessionName: 'Try 1',
            userName: 'test_user',
            accessKey: 'test_key',
            os: 'OS X',
            osVersion: 'Monterey',
            buildName: 'Nightwatch Programmatic Api Demo'
          },
          'goog:chromeOptions': {
            w3c: false
          }
        }
      }
    });

    assert.strictEqual(client.api.isAppiumClient(), false);
  });

  it('Test create session with browserstack and browserName set to null (App Automate)', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {

        assert.deepEqual(requestBody, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              'appium:app': 'bs://878bdf21505f0004ce',
              'bstack:options': {
                local: 'false',
                sessionName: 'Try 1',
                userName: 'test_user',
                accessKey: 'test_key',
                osVersion: '14',
                deviceName: 'iPhone 12',
                realMobile: 'true',
                buildName: 'Nightwatch Programmatic Api Demo'
              }
            }
          }
        });

        return {
          value: {
            sessionId: '1352110219202',
            capabilities: {
              platform: 'MAC',
              platformName: 'iOS',
              deviceName: 'iPhone 12',
              realMobile: true
            }
          }
        };
      });

    nock('https://api-cloud.browserstack.com')
      .post('/app-automate/upload')
      .reply(200, {
        app_url: 'bs://878bdf21505f0004ce'
      });

    nock('https://api.browserstack.com')
      .get('/app-automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'WIN_CHROME_PROD_SANITY_LIVE_1831',
            duration: 47,
            status: 'running',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasds',
            build_tag: null
          }
        },
        {
          automation_build: {
            name: 'External monitoring - aps - 2022-08-30',
            duration: 44,
            status: 'done',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasdk',
            build_tag: null
          }
        }
      ]);

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        host: 'hub.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'bstack:options': {
          local: 'false',
          userName: 'test_user',
          accessKey: 'test_key',
          osVersion: '14',
          deviceName: 'iPhone 12',
          realMobile: 'true'
        },
        browserName: null,
        chromeOptions: {
          w3c: false
        },
        appUploadUrl: 'https://some_host.com/app.apk'
      },

      parallel: false
    });

    client.mergeCapabilities({
      name: 'Try 1',
      build: 'Nightwatch Programmatic Api Demo'
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        platform: 'MAC',
        platformName: 'iOS',
        deviceName: 'iPhone 12',
        realMobile: true
      }
    });
  
    assert.strictEqual(client.transport.uploadedAppUrl, 'bs://878bdf21505f0004ce');

    assert.strictEqual(client.settings.selenium.use_appium, undefined);
    assert.strictEqual(client.api.isAppiumClient(), true);
  });

  it('Test create session with Browserstack App Automate using custom id', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        assert.deepEqual(requestBody, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              'appium:automationName': 'UiAutomator2',
              'appium:platformVersion': '9.0',
              'appium:deviceName': 'Google Pixel 3',
              'appium:app': 'sample_app',
              'browserName': '',
              'bstack:options': {
                local: 'false',
                sessionName: 'Try 1',
                userName: 'test_user',
                accessKey: 'test_key',
                realMobile: true,
                buildName: 'Nightwatch Programmatic Api Demo'
              }
            }
          }
        });

        return {
          value: {
            sessionId: '1352110219202',
            capabilities: {
              platform: 'LINUX',
              platformName: 'Android',
              deviceName: '8B3X12Y71',
              automationName: 'uiautomator2',
              platformVersion: '9',
              realMobile: true
            }
          }
        };
      });

    nock('https://api-cloud.browserstack.com')
      .post('/app-automate/upload')
      .reply(200, function (uri, requestBody) {
        const body = requestBody.toString();
        assert.strictEqual(body.includes('name="custom_id"'), true);
        assert.strictEqual(body.includes('sample_app'), true);
        assert.strictEqual(body.includes('name="file"; filename="nightwatch.json"'), true);

        return {
          app_url: 'bs://878bdf21505f0004ce',
          custom_id: 'sample_app',
          shareable_id: 'test_user/sample_app'
        };
      });

    nock('https://api.browserstack.com')
      .get('/app-automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'WIN_CHROME_PROD_SANITY_LIVE_1831',
            duration: 47,
            status: 'running',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasds',
            build_tag: null
          }
        },
        {
          automation_build: {
            name: 'External monitoring - aps - 2022-08-30',
            duration: 44,
            status: 'done',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasdk',
            build_tag: null
          }
        }
      ]);

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        host: 'hub.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'bstack:options': {
          local: 'false',
          userName: 'test_user',
          accessKey: 'test_key',
          realMobile: true
        },
        'appium:options': {
          automationName: 'UiAutomator2',
          app: 'sample_app',
          deviceName: 'Google Pixel 3',
          platformVersion: '9.0'
        },
        browserName: '',
        appUploadPath: path.resolve(__dirname, '../../extra/nightwatch.json')
      },
      parallel: false
    });

    client.mergeCapabilities({
      name: 'Try 1',
      build: 'Nightwatch Programmatic Api Demo'
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        platform: 'LINUX',
        platformName: 'Android',
        deviceName: '8B3X12Y71',
        automationName: 'uiautomator2',
        platformVersion: '9',
        realMobile: true
      }
    });

    assert.strictEqual(client.transport.uploadedAppUrl, undefined);

    assert.strictEqual(client.settings.selenium.use_appium, undefined);
    assert.strictEqual(client.api.isAppiumClient(), true);
  });

  it('Test create session with browserstack and when buildName is not set', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {

        assert.deepEqual(requestBody, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              browserName: 'firefox',
              'bstack:options': {
                local: 'false',
                userName: 'test_user',
                accessKey: 'test_key',
                os: 'OS X',
                osVersion: 'Monterey',
                buildName: 'nightwatch-test-build'
              }
            }
          }
        });

        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'WIN_CHROME_PROD_SANITY_LIVE_1831',
            duration: 47,
            status: 'running',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasds',
            build_tag: null
          }
        },
        {
          automation_build: {
            name: 'External monitoring - aps - 2022-08-30',
            duration: 44,
            status: 'done',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasdk',
            build_tag: null
          }
        }
      ]);

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        host: 'hub.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'bstack:options': {
          local: 'false',
          userName: 'test_user',
          accessKey: 'test_key',
          os: 'OS X',
          osVersion: 'Monterey'
        },
        chromeOptions: {
          w3c: false
        }
      },

      parallel: false
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: {
          browserName: 'firefox',
          'bstack:options': {
            local: 'false',
            userName: 'test_user',
            accessKey: 'test_key',
            os: 'OS X',
            osVersion: 'Monterey',
            buildName: 'nightwatch-test-build'
          }
        }
      }
    });
  });

  it('Test create session with browserstack with random browser and update buildName', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        assert.deepEqual(requestBody, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              browserName: 'acmeBrowser',
              'bstack:options': {
                local: 'false',
                sessionName: 'Try 1',
                userName: 'test_user',
                accessKey: 'test_key',
                os: 'OS X',
                osVersion: 'Monterey',
                buildName: 'Nightwatch Programmatic Api Demo'
              }
            }
          }
        });

        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'WIN_CHROME_PROD_SANITY_LIVE_1831',
            duration: 47,
            status: 'running',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasds',
            build_tag: null
          }
        },
        {
          automation_build: {
            name: 'External monitoring - aps - 2022-08-30',
            duration: 44,
            status: 'done',
            hashed_id: '8dd73aad3365429dec0ec12cf64c0c475a22dasdk',
            build_tag: null
          }
        }
      ]);

    const client = Nightwatch.createClient({
      webdriver: {
        start_process: false
      },
      selenium: {
        host: 'hub.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'bstack:options': {
          local: 'false',
          userName: 'test_user',
          accessKey: 'test_key',
          os: 'OS X',
          osVersion: 'Monterey'
        },
        browserName: 'acmeBrowser'
      },
      parallel: false
    });

    client.mergeCapabilities({
      name: 'Try 1',
      buildName: 'Nightwatch Programmatic Api Demo'
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: {
          browserName: 'acmeBrowser',
          'bstack:options': {
            local: 'false',
            sessionName: 'Try 1',
            userName: 'test_user',
            accessKey: 'test_key',
            os: 'OS X',
            osVersion: 'Monterey',
            buildName: 'Nightwatch Programmatic Api Demo'
          }
        }
      }
    });
  });
});
