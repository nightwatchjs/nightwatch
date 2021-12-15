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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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

    let client = Nightwatch.createClient({
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
      let client = Nightwatch.createClient({
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
});
