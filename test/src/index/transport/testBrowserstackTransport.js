const assert = require('assert');
const nock = require('nock');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const SeleniumRemote = common.require('transport/selenium-webdriver/selenium.js');
const Browserstack = common.require('transport/selenium-webdriver/browserstack.js');

describe('BrowserstackTransport', function () {
  beforeEach(function() {
    try {
      nock.activate();
      // eslint-disable-next-line no-empty
    } catch (err) {}
  });

  afterEach(function() {
    nock.restore();
  });

  it('test create Transport for Browserstack - empty credentials', function() {
    assert.throws(function() {
      NightwatchClient.client({
        webdriver: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        }
      });
    }, /BrowserStack access key is not set\. Verify that "browserstack\.key" capability is set correctly or set BROWSERSTACK_KEY environment variable \(\.env files are supported\)\./);

    assert.throws(function() {
      NightwatchClient.client({
        webdriver: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        },
        desiredCapabilities: {
          'browserstack.key': 'test-access-key'
        }
      });
    }, /BrowserStack username is not set\. Verify that "browserstack\.user" capability is set correctly or set BROWSERSTACK_USER environment variable \(\.env files are supported\)\./);

  });

  it('test create Transport for Browserstack - env variable credentials', function() {
    process.env['USER'] = 'test-access-user';
    process.env['KEY'] = 'test-access-key';

    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'browserstack.user': '${USER}',
        'browserstack.key': '${KEY}'
      }
    });

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);
    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');

    delete process.env['USER'];
    delete process.env['KEY'];
  });

  it('test create Transport for Browserstack', function(done) {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'nightwatch-test-build',
            hashed_id: '123-567-89'
          }
        },
        {
          automation_build: {
            name: 'test-build'
          }
        }
      ]);

    assert.ok(client.transport instanceof Browserstack);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.start_process, false);
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);
    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');

    client.emit('nightwatch:session.create', {
      sessionId: '1234567'
    });
    setTimeout(async function() {
      assert.strictEqual(transport.buildId, '123-567-89');

      try {
        let result;
        nock('https://api.browserstack.com')
          .put('/automate/sessions/1234567.json', {
            status: 'passed',
            reason: ''
          })
          .reply(200, {});

        result = await transport.testSuiteFinished(false);
        assert.strictEqual(result, true);
        assert.strictEqual(transport.sessionId, null);

        done();
      } catch (e) {
        done(e);
      }
    }, 100);

  });

  it('test create Transport for Browserstack with failures', function(done) {
    const client = NightwatchClient.client({
      output: false,
      silent: false,
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'nightwatch-test-build',
            hashed_id: '123-567-89'
          }
        },
        {
          automation_build: {
            name: 'test-build'
          }
        }
      ]);

    const {transport} = client;
    client.emit('nightwatch:session.create', {
      sessionId: '1234567'
    });
    setTimeout(async function() {
      try {
        let result;
        nock('https://api.browserstack.com')
          .put('/automate/sessions/1234567.json', {
            status: 'failed',
            reason: 'NightwatchAssertError: Timed out while waiting for element <#james> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5400ms)'
          })
          .reply(200, {});

        const error = new Error('Timed out while waiting for element <#james> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5400ms)');
        error.name = 'NightwatchAssertError';

        result = await transport.testSuiteFinished(error);

        assert.strictEqual(result, true);
        assert.strictEqual(transport.sessionId, null);

        done();
      } catch (e) {
        done(e);
      }
    }, 100);

  });
});
