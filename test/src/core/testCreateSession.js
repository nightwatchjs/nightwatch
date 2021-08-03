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

    const session = await client.createSession({
      headless: true
    });

    assert.deepStrictEqual(session, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'firefox', version: 'TEST', platform: 'TEST'}
    });
    assert.deepStrictEqual(client.transport.options.get('moz:firefoxOptions'), {args: ['-headless']});
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

    const session = await client.createSession({
      headless: true
    });

    assert.deepStrictEqual(session, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'chrome', version: 'TEST', platform: 'TEST'}
    });
    assert.deepStrictEqual(client.transport.options.get('goog:chromeOptions'), {args: ['headless']});
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

    const session = await client.createSession({
      headless: true
    });

    assert.deepStrictEqual(session, {
      sessionId: '1352110219202',
      capabilities: {browserName: 'MicrosoftEdge', version: 'TEST', platform: 'TEST'}
    });

    assert.deepStrictEqual(client.transport.options.get('ms:edgeOptions'), {args: ['headless']});
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

    const session = await client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.transport.options.get('goog:chromeOptions'), {
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

    const session = await client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.transport.options.get('ms:edgeOptions'), {
      args: [
        '--no-sandbox',
        'headless'
      ]
    });
  });
});
