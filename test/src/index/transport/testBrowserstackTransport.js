const assert = require('assert');
const nock = require('nock');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const SeleniumRemote = common.require('transport/selenium-webdriver/selenium.js');
const Automate = common.require('transport/selenium-webdriver/browserstack/automate.js');
const AppAutomate = common.require('transport/selenium-webdriver/browserstack/appAutomate.js');
const AutomateTurboScale = common.require('transport/selenium-webdriver/browserstack/automateTurboScale.js');

describe('BrowserstackTransport', function () {
  beforeEach(function() {
    try {
      nock.activate();
      // eslint-disable-next-line no-empty
    } catch (err) {}
  });

  afterEach(function() {
    nock.cleanAll();
    nock.restore();
  });

  it('test create Transport for Browserstack - empty credentials', function() {
    assert.rejects(async function() {
      const client = NightwatchClient.client({
        webdriver: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        }
      });

      await client.transport.createSession({argv: undefined, moduleKey: ''});

    }, /BrowserStack access key is not set\. Verify that "browserstack\.key" capability is set correctly or set BROWSERSTACK_KEY environment variable \(\.env files are supported\)\./);

    assert.rejects(async function() {
      const client = NightwatchClient.client({
        webdriver: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        },
        desiredCapabilities: {
          'browserstack.key': 'test-access-key'
        }
      });

      await client.transport.createSession({argv: undefined, moduleKey: ''});

    }, /BrowserStack username is not set\. Verify that "browserstack\.user" capability is set correctly or set BROWSERSTACK_USER environment variable \(\.env files are supported\)\./);

  });

  it('test create Transport for Browserstack - env variable credentials', async function() {
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

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=0')
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
    const result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    assert.ok(transport instanceof SeleniumRemote);
    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');

    delete process.env['USER'];
    delete process.env['KEY'];
  });

  it('test create Transport for Browserstack - Automate', async function() {
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

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=0')
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

    assert.ok(client.transport instanceof Automate);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    nock('https://api.browserstack.com')
      .get('/automate/sessions/1234567.json')
      .reply(200, {
        automation_session: {status: 'done'}
      });
    nock('https://api.browserstack.com')
      .put('/automate/sessions/1234567.json', {
        status: 'passed',
        reason: ''
      })
      .reply(200, {});

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(transport.buildId, '123-567-89');

  });

  it('test create Transport for Browserstack - Automate (port 4444)', async function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 4444,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('http://hub-cloud.browserstack.com:4444')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=0')
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

    assert.ok(client.transport instanceof Automate);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, false);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    let sessionNockCalled = 0;

    nock('https://api.browserstack.com')
      .get('/automate/sessions/1234567.json')
      .reply(200, function () {
        sessionNockCalled++;

        return {automation_session: {status: 'done'}};
      });
    nock('https://api.browserstack.com')
      .put('/automate/sessions/1234567.json', {
        status: 'passed',
        reason: ''
      })
      .reply(200, function () {
        sessionNockCalled++;

        return {};
      });

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(transport.buildId, '123-567-89');
    assert.strictEqual(sessionNockCalled, 2);
  });

  it('test create Transport for Browserstack - App Automate', async function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: ''
      }
    });

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/app-automate/builds.json?status=running&limit=20&offset=0')
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

    assert.ok(client.transport instanceof AppAutomate);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    nock('https://api.browserstack.com')
      .get('/app-automate/sessions/1234567.json')
      .reply(200, {
        automation_session: {status: 'done'}
      });
    nock('https://api.browserstack.com')
      .put('/app-automate/sessions/1234567.json', {
        status: 'passed',
        reason: ''
      })
      .reply(200, {});

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(transport.buildId, '123-567-89');
  });

  it('test create Transport for Browserstack - Automate TurboScale', async function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack-ats.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('https://hub-cloud.browserstack-ats.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/builds?status=running&limit=20&offset=0')
      .reply(200, {
        'builds': [
          {
            name: 'nightwatch-test-build',
            hashed_id: '123-567-89'
          },
          {
            name: 'test-build'
          }
        ]
      });

    assert.ok(client.transport instanceof AutomateTurboScale);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack-ats.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    assert.strictEqual(result.sessionId, '1352110219202');

    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    let sessionNockCalled = 0;

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/sessions/1352110219202')
      .reply(200, function(){
        sessionNockCalled++;

        return {status: 'done'};
      });
    nock('https://api.browserstack.com')
      .patch('/automate-turboscale/v1/sessions/1352110219202', {
        status: 'passed',
        reason: ''
      })
      .reply(200, function(){
        sessionNockCalled++;

        return {};
      });

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(sessionNockCalled, 2);
    assert.strictEqual(transport.buildId, '123-567-89');
  });

  it('test create Transport for Browserstack with failures', async function() {
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

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=0')
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
    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    return new Promise((resolve, reject) => {
      setTimeout(async function() {
        try {
          nock('https://api.browserstack.com')
            .get('/automate/sessions/1234567.json')
            .reply(200, {
              automation_session: {status: 'done'}
            });
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
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  });

  it('test create Transport for Browserstack - Automate and Check the result in second page', async function() {
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

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=0')
      .reply(200, [
        {
          automation_build: {
            name: 'nightwatch-test',
            hashed_id: '123-56'
          }
        },
        {
          automation_build: {
            name: 'test-build'
          }
        }
      ]);

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=20')
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
    assert.ok(client.transport instanceof Automate);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    nock('https://api.browserstack.com')
      .get('/automate/sessions/1234567.json')
      .reply(200, {
        automation_session: {status: 'done'}
      });
    nock('https://api.browserstack.com')
      .put('/automate/sessions/1234567.json', {
        status: 'passed',
        reason: ''
      })
      .reply(200, {});

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(transport.buildId, '123-567-89');

  });

  it('test create Transport for Browserstack - Automate and return undefined for empty array', async function() {
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
    let buildsMockCalled = 0;

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=0')
      .reply(200, function() {
        buildsMockCalled++;

        return [];
      });
    nock('https://api.browserstack.com')
      .get('/automate/builds.json?status=running&limit=20&offset=20')
      .reply(200, function() {
        buildsMockCalled++;

        return [];
      });

    assert.ok(client.transport instanceof Automate);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    result.sessionId = '1234567';
    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    nock('https://api.browserstack.com')
      .get('/automate/sessions/1234567.json')
      .reply(200, {
        automation_session: {status: 'done'}
      });
    nock('https://api.browserstack.com')
      .put('/automate/sessions/1234567.json', {
        status: 'passed',
        reason: ''
      })
      .reply(200, {});

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(buildsMockCalled, 1);
    assert.strictEqual(transport.buildId, undefined);

  });

  it('test create Transport for Browserstack - Automate TurboScale And and Check the result in second page', async function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack-ats.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('https://hub-cloud.browserstack-ats.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/builds?status=running&limit=20&offset=0')
      .reply(200, {
        'builds': [
          {
            name: 'test',
            hashed_id: '123-567-89'
          },
          {
            name: 'test-build'
          }
        ]
      });

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/builds?status=running&limit=20&offset=20')
      .reply(200, {
        'builds': [
          {
            name: 'nightwatch-test-build',
            hashed_id: '123-567-89'
          },
          {
            name: 'test-build'
          }
        ]
      });

    assert.ok(client.transport instanceof AutomateTurboScale);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack-ats.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    assert.strictEqual(result.sessionId, '1352110219202');

    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    let sessionNockCalled = 0;

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/sessions/1352110219202')
      .reply(200, function(){
        sessionNockCalled++;

        return {status: 'done'};
      });
    nock('https://api.browserstack.com')
      .patch('/automate-turboscale/v1/sessions/1352110219202', {
        status: 'passed',
        reason: ''
      })
      .reply(200, function(){
        sessionNockCalled++;

        return {};
      });

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(sessionNockCalled, 2);
    assert.strictEqual(transport.buildId, '123-567-89');
  });

  it('test create Transport for Browserstack - Automate TurboScale and return undefined for empty array', async function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack-ats.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });
    let buildsMockCalled = 0;

    nock('https://hub-cloud.browserstack-ats.com')
      .post('/wd/hub/session')
      .reply(201, function (uri, requestBody) {
        return {
          value: {
            sessionId: '1352110219202',
            capabilities: requestBody.capabilities
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/builds?status=running&limit=20&offset=0')
      .reply(200, function() {
        buildsMockCalled++;

        return {'builds': []};
      });
    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/builds?status=running&limit=20&offset=20')
      .reply(200, function() {
        buildsMockCalled++;

        return {'builds': []};
      });

    assert.ok(client.transport instanceof AutomateTurboScale);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack-ats.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.ok(transport instanceof SeleniumRemote);

    let result = await transport.createSession({argv: undefined, moduleKey: ''});
    assert.strictEqual(result.sessionId, '1352110219202');

    client.emit('nightwatch:session.create', result);

    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');
    assert.strictEqual(client.settings.webdriver.start_process, false);

    let sessionNockCalled = 0;

    nock('https://api.browserstack.com')
      .get('/automate-turboscale/v1/sessions/1352110219202')
      .reply(200, function(){
        sessionNockCalled++;

        return {status: 'done'};
      });
    nock('https://api.browserstack.com')
      .patch('/automate-turboscale/v1/sessions/1352110219202', {
        status: 'passed',
        reason: ''
      })
      .reply(200, function(){
        sessionNockCalled++;

        return {};
      });

    result = await transport.testSuiteFinished(false);
    assert.strictEqual(result, true);
    assert.strictEqual(transport.sessionId, null);

    assert.strictEqual(sessionNockCalled, 2);
    assert.strictEqual(buildsMockCalled, 1);
    assert.strictEqual(transport.buildId, undefined);
  });

});
