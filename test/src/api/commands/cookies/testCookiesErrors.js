const assert = require('assert');
const common = require('../../../../common.js');
const SimplifiedReporter = common.require('reporter/simplified.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const MockServer  = require('../../../../lib/mockserver.js');

describe('getCookiesErrors', function() {
  class Reporter extends SimplifiedReporter {
    constructor(settings) {
      super(settings);

      this.errors = 0;
    }

    registerTestError(err) {
      this.errors++;
    }
  }

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  after(function(done) {
    this.server.close(() => done());
  });

  it('client.getCookies() - unhandled error', async function() {
    const reporter = new Reporter({});
    const client = await Nightwatch.initClient({
      report_command_errors: true,
      webdriver: {
        start_process: false
      },
      desiredCapabilities: {
        name: 'testSuite'
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      output: false,
      silent: false
    }, reporter);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      statusCode: 500,
      response: {
        sessionId: '1352110219202',
        state: 'unhandled error',
        value: {
          message: 'test message'
        },
        status: 13
      }
    }, true);

    client.api.getCookies(function callback(result) {
      assert.ok(result.error instanceof Error);
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.error.message, 'test message');
      assert.strictEqual(result.error.name, 'WebDriverError');
    });

    await new Promise((resolve, reject) => {
      client.start(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    assert.strictEqual(client.reporter.errors, 1);
  });

  it('client.getCookies() - socket hang up error', async function() {
    const reporter = new Reporter({});
    const client = await Nightwatch.initClient({
      report_command_errors: false,
      desiredCapabilities: {
        name: 'testSuite'
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      webdriver: {
        start_process: false,
        timeout_options: {
          timeout: 50
        }
      },
      output: false,
      silent: false
    }, reporter);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      socketDelay: 200,
      response: ''
    }, true);

    client.api.getCookies(function callback(result) {
      assert.ok(result.error instanceof Error);
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.error.message, 'ECONNRESET socket hang up');
      assert.strictEqual(result.error.code, 'ECONNRESET');
    });

    await new Promise((resolve, reject) => {
      client.start(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
});
