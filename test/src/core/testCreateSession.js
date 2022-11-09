const assert = require('assert');
const nock = require('nock');
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
    assert.deepStrictEqual(sessionOptions.get('goog:chromeOptions'), {args: ['headless']});
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
        'headless'
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

  it('Test create session with browsername null - mobile support', async function () {

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

  it('Test create session with browserstack', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        const reqObj = JSON.parse(requestBody);

        assert.deepEqual(reqObj, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              browserName: 'chrome',
              'bstack:options': {
                local: 'false',
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
            capabilities: reqObj.capabilities
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
  });

  it('Test create session with browserstack and browserName set to null', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        const reqObj = JSON.parse(requestBody);

        assert.deepEqual(reqObj, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              'bstack:options': {
                local: 'false',
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
            capabilities: reqObj.capabilities
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
          osVersion: '14',
          deviceName: 'iPhone 12',
          realMobile: 'true'
        },
        browserName: null,
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
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: {
          'bstack:options': {
            local: 'false',
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
  });

  it('Test create session with browserstack and when buildName is not set', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        const reqObj = JSON.parse(requestBody);

        assert.deepEqual(reqObj, {
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
            capabilities: reqObj.capabilities
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

  it('Test create session with browserstack and update buildName', async function () {
    nock('https://hub.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        const reqObj = JSON.parse(requestBody);

        assert.deepEqual(reqObj, {
          capabilities: {
            firstMatch: [{}],
            alwaysMatch: {
              browserName: 'chrome',
              'bstack:options': {
                local: 'false',
                userName: 'test_user',
                accessKey: 'test_key',
                os: 'OS X',
                osVersion: 'Monterey',
                buildName: 'Nightwatch Programmatic Api Demo'
              },
              'goog:chromeOptions': {w3c: false}
            }
          }
        });

        return {
          value: {
            sessionId: '1352110219202',
            capabilities: reqObj.capabilities
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
      buildName: 'Nightwatch Programmatic Api Demo'
    });

    const result = await client.createSession();
    assert.deepStrictEqual(result, {
      sessionId: '1352110219202',
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: {
          browserName: 'chrome',
          'bstack:options': {
            local: 'false',
            userName: 'test_user',
            accessKey: 'test_key',
            os: 'OS X',
            osVersion: 'Monterey',
            buildName: 'Nightwatch Programmatic Api Demo'
          },
          'goog:chromeOptions': {w3c: false}
        }
      }
    });
  });
});
