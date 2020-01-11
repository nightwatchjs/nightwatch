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

  after(function() {
    Nocks.disable();
  });

  it('Test initialization with credentials', function (done) {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .basicAuth({
        user: 'testusername',
        pass: '123456'
      })
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
      output: false,
      username: 'testusername',
      access_key: '123456'
    });

    client.on('nightwatch:session.create', function (data) {
      assert.equal(data.sessionId, '1352110219202');
      done();
    });

    client.startSession();
  });

  it('Test create session with headless mode in Firefox', function () {
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

    assert.deepStrictEqual(client.settings.desiredCapabilities, {
      alwaysMatch: {
        'moz:firefoxOptions': {
          args: ['-headless']
        }
      },
      browserName: 'firefox',
      platform: 'ANY'
    });
  });

  it('Test create session with headless mode in Chrome', function () {
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
      chromeOptions: {
        args: ['--headless']
      },
      browserName: 'chrome',
      platform: 'ANY'
    });
  });

  it('Test create session with headless mode in Chrome with existing args', function () {
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
          args : ['--no-sandbox']
        }
      }
    });

    client.createSession({
      headless: true
    });

    assert.deepStrictEqual(client.settings.desiredCapabilities, {
      chromeOptions: {
        args: ['--no-sandbox', '--headless']
      },
      browserName: 'chrome',
      platform: 'ANY'
    });
  });
});
