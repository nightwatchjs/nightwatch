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

  xit('Test create session with headless mode in Firefox', function () {
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

    client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.session.desiredCapabilities, {
      alwaysMatch: {
        'moz:firefoxOptions': {
          args: ['-headless']
        }
      },
      browserName: 'firefox'
    });
  });

  xit('Test create session with headless mode in Chrome', function () {
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

    client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.settings.desiredCapabilities, {
      'goog:chromeOptions': {
        args: ['--headless']
      },
      browserName: 'chrome'
    });
  });

  xit('Test create session with headless mode in Edge', function () {
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

    client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.settings.desiredCapabilities, {
      'ms:edgeOptions': {
        args: ['--headless']
      },
      browserName: 'MicrosoftEdge'
    });
  });

  xit('Test create session with headless mode in Chrome with existing args', function () {
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
        chromeOptions: {
          args: ['--no-sandbox']
        }
      }
    });

    client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.settings.desiredCapabilities, {
      'goog:chromeOptions': {
        args: ['--no-sandbox', '--headless']
      },
      browserName: 'chrome'
    });
  });

  xit('Test create session with headless mode in Edge with existing args', function () {
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
        edgeOptions: {
          args: ['--no-sandbox']
        }
      }
    });

    client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.settings.desiredCapabilities, {
      'ms:edgeOptions': {
        args: ['--no-sandbox', '--headless']
      },
      browserName: 'MicrosoftEdge'
    });
  });
});
