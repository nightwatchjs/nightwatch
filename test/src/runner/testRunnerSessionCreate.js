const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerSessionCreate', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunner with session create error using webdriver', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'firefox', 'nightwatch:options': {name: 'test-Name'}}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'firefox',  'nightwatch:options': {name: 'test-Name'}}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    const globals = {
      reporter(results) {
        const sep = path.sep;
        assert.strictEqual(results.errors, 2);
        assert.strictEqual(Object.keys(results.modules).length, 2);
        assert.ok(Object.keys(results.modules).includes(`async${sep}test${sep}sample`));
        assert.ok(Object.keys(results.modules).includes(`simple${sep}test${sep}sample`));
        assert.ok(results.lastError instanceof Error);

        assert.strictEqual(results.lastError.message, 'An error occurred while creating a new GeckoDriver session: [SessionNotCreatedError] Session is already started');
      }
    };

    return runTests({'reuse-browser': true, source: testsPath}, settings({
      desiredCapabilities: {
        'nightwatch:options': {
          name: 'test-Name'
        }
      },
      selenium_host: null,
      webdriver: {
        host: 'localhost'
      },
      globals,
      output: false,
      output_folder: false
    }));
  });

  it('testRunner with session create error using webdriver with --fail-fast argv', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'firefox', 'nightwatch:options': {name: 'test-Name'}}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'firefox', 'nightwatch:options': {name: 'test-Name'}}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    const globals = {
      reporter(results) {
        assert.strictEqual(results.errors, 1);
        assert.strictEqual(Object.keys(results.modules).length, 1);
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.message, 'An error occurred while creating a new GeckoDriver session: [SessionNotCreatedError] Session is already started');
      }
    };

    return runTests({
      source: testsPath,
      'fail-fast': true
    }, settings({
      desiredCapabilities: {
        'nightwatch:options': {name: 'test-Name'}
      },
      selenium_host: null,
      webdriver: {
        host: 'localhost'
      },
      globals,
      output: false,
      output_folder: false
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.name, 'SessionNotCreatedError');
    });

  });

  it('testRunner with session create error using webdriver with enable_fail_fast setting', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'firefox', 'nightwatch:options': {name: 'test-Name'}}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'firefox', 'nightwatch:options': {name: 'test-Name'}}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    const globals = {
      reporter(results) {
        assert.strictEqual(results.errors, 1);
        assert.strictEqual(Object.keys(results.modules).length, 1);
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.message, 'An error occurred while creating a new GeckoDriver session: [SessionNotCreatedError] Session is already started');
      }
    };

    return runTests({
      source: testsPath
    }, settings({
      desiredCapabilities: {
        'nightwatch:options': {name: 'test-Name'}
      },
      selenium_host: null,
      webdriver: {
        host: 'localhost'
      },
      globals,
      output: false,
      output_folder: false,
      enable_fail_fast: true
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.name, 'SessionNotCreatedError');
    });

  });

  it('testRunner with session ECONNREFUSED error using webdriver', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    const globals = {
      reporter(results) {
        assert.strictEqual(results.errors, 2);
        assert.strictEqual(results.errmessages.length, 2);
        assert.strictEqual(Object.keys(results.modules).length, 2);

        assert.strictEqual(results.lastError.sessionCreate, true);
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.code, 'ECONNREFUSED');
        assert.strictEqual(results.lastError.showTrace, false);
        assert.match(results.lastError.message, /An error occurred while creating a new GeckoDriver session: Connection refused to .*9999\. If the Webdriver\/Selenium service is managed by Nightwatch, check if "start_process" is set to "true"\./);
      }
    };

    return runTests(testsPath, settings({
      selenium_host: null,
      webdriver: {
        host: 'localhost',
        port: 9999
      },
      output: false,
      globals
    })).catch(err => {
      assert.ok(err instanceof Error);
      if (err.code === 'ERR_ASSERTION') {
        throw err;
      }
      assert.strictEqual(err.code, 'ECONNREFUSED');
      assert.strictEqual(err.sessionCreate, true);
      assert.strictEqual(err.sessionConnectionRefused, true);
    });
  });

  it('testRunner with not found server_path error', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/simple')
    ];

    const globals = {
      reporter(results) {
        assert.strictEqual(results.errors, 1);
        assert.strictEqual(results.errmessages.length, 1);
        assert.strictEqual(Object.keys(results.modules).length, 1);

        assert.strictEqual(results.lastError.sessionCreate, true);
        assert.strictEqual(results.lastError.showTrace, false);
        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError.detailedErr.includes('verify if webdriver is configured correctly; using:'));
        assert.strictEqual(results.lastError.message, 'Unable to create the GeckoDriver process: The specified executable path does not exist: /bin/xxxxx');
      }
    };

    return runTests(testsPath, settings({
      selenium_host: null,
      webdriver: {
        start_process: true,
        server_path: '/bin/xxxxx',
        host: 'localhost',
        port: 4444
      },
      globals
    })).catch(err => {
      assert.ok(err instanceof Error);
      if (err.code === 'ERR_ASSERTION') {
        throw err;
      }
      assert.strictEqual(err.code, 'ECONNREFUSED');
      assert.strictEqual(err.sessionCreate, true);
      assert.strictEqual(err.sessionConnectionRefused, true);
    });
  });

  it('testRunner with incorrect server_path error', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/simple')
    ];

    const globals = {
      reporter(results) {
        assert.strictEqual(results.errors, 1);
        assert.strictEqual(results.errmessages.length, 1);
        assert.strictEqual(Object.keys(results.modules).length, 1);

        assert.strictEqual(results.lastError.sessionCreate, true);
        assert.strictEqual(results.lastError.showTrace, false);
        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError.detailedErr.startsWith(' Verify if GeckoDriver is configured correctly; using:'));
        assert.strictEqual(results.lastError.message, 'An error occurred while creating a new GeckoDriver session: [Error] Server terminated early with status 9');
      }
    };

    return runTests(testsPath, settings({
      selenium_host: null,
      webdriver: {
        start_process: true,
        server_path: process.argv[0],
        host: 'localhost',
        port: 4444
      },
      globals
    })).catch(err => {
      assert.ok(err instanceof Error);
      if (err.code === 'ERR_ASSERTION') {
        throw err;
      }
      assert.strictEqual(err.code, 'ECONNREFUSED');
      assert.strictEqual(err.sessionCreate, true);
      assert.strictEqual(err.sessionConnectionRefused, true);
    });
  });

  it('test runner with reusing browser sessions', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/reusebrowser')];

    MockServer.addMock({
      url: '/session',
      statusCode: 200,
      postdata: JSON.stringify({
        desiredCapabilities: {browserName: 'firefox', name: 'first-test'},
        capabilities: {alwaysMatch: {browserName: 'firefox'}}
      }),
      response: JSON.stringify({
        status: 0,
        sessionId: '1352110219202'
      })
    }, true);

    MockServer.addMock({
      url: '/session/1352110219202',
      method: 'DELETE',
      statusCode: 200,
      response: JSON.stringify({
        status: 0
      })
    }, true);


   

    const globals = {
      reporter(results) {
        const sep = path.sep;
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(Object.keys(results.modules).length, 2);
        assert.ok(Object.keys(results.modules).includes('firstTest'));
        assert.ok(Object.keys(results.modules).includes('secondTest'));
      }
    };

    return runTests({
      source: testsPath,
      'reuse-browser': true
    }, settings({
      selenium_host: null,
      webdriver: {
        host: 'localhost'
      },
      globals,
      output: false,
      output_folder: false
    })); 
  });

  it('test runner with reusing browser sessions - using globals', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/reusebrowser')];

    MockServer.addMock({
      url: '/session',
      statusCode: 200,
      postdata: JSON.stringify({
        desiredCapabilities: {browserName: 'firefox', name: 'first-test'},
        capabilities: {alwaysMatch: {browserName: 'firefox'}}
      }),
      response: JSON.stringify({
        status: 0,
        sessionId: '1352110219202'
      })
    }, true);

    MockServer.addMock({
      url: '/session/1352110219202',
      method: 'DELETE',
      statusCode: 200,
      response: JSON.stringify({
        status: 0
      })
    }, true);


   

    const globals = {
      reuseBrowserSession: true,
      reporter(results) {
        const sep = path.sep;
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(Object.keys(results.modules).length, 2);
        assert.ok(Object.keys(results.modules).includes('firstTest'));
        assert.ok(Object.keys(results.modules).includes('secondTest'));
      }
    };

    return runTests({
      source: testsPath
    }, settings({
      selenium_host: null,
      webdriver: {
        host: 'localhost'
      },
      globals,
      output: false,
      output_folder: false
    })); 
  });
});
