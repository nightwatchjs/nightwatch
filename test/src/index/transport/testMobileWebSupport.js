const assert = require('assert');
const common = require('../../../common.js');
const path = require('path');
const CommandGlobals = require('../../../lib/globals/commands.js');
const MockServer = require('../../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const Transport = require('../../../../lib/transport/selenium-webdriver/index.js');
const {IosSessionNotCreatedError, AndroidConnectionError} = common.require('utils/mobile.js');
const mockery = require('mockery');

describe.only('MobileSupport', function () {
  before(function () {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  })

  beforeEach(function (done) {
    this.getDriverBackup = Transport.prototype.getDriver;
    this.createDriverServiceBackup = Transport.prototype.createDriverService;
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    this.server = MockServer.init();

    this.server.on('listening', () => {
      done()
    });
  });

  afterEach(function (done) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    Transport.prototype.getDriver = this.getDriverBackup;
    Transport.prototype.createDriverService = this.createDriverServiceBackup;

    CommandGlobals.afterEach.call(this, function () {
      done();
    });
  });

  it('error classes for mobile-web support - RealIosDeviceIdError', function () {
    let src_folders = [
      path.join(__dirname, '../../../sampletests/withsubfolders')
    ];

    return runTests({}, settings({
      output: false,
      src_folders,
      desiredCapabilities: {
        browserName: 'safari',
        platformName: 'iOS',
        alwaysMatch: {
          acceptInsecureCerts: false
        }
      },

      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // --verbose
        ]
      }
    })).catch(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.name, 'RealIosDeviceIdError');
      assert.strictEqual(err.message, 'Real Device ID is neither configured nor passed');
      assert.strictEqual(err.help.length, 4)
    })
  });

  it('error classes for mobile-web support - IosSessionNotCreatedError', function () {
    Transport.prototype.getDriver = function() {
      const err = new Error('An error occurred while creating a new SafariDriver session');
      err.name = 'SessionNotCreatedError';

      throw err;
    };

    Transport.prototype.createDriverService = async function() { 
      this.driverService = {
        getOutputFilePath(){},
        getSettingsFormatted(){}
      };
    };

    let src_folders = [
      path.join(__dirname, '../../../sampletests/withfailures'),
      path.join(__dirname, '../../../sampletests/withsubfolders')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError instanceof IosSessionNotCreatedError);
        assert.ok(Object.prototype.hasOwnProperty.call(results.lastError, 'name'));
        assert.ok(Object.prototype.hasOwnProperty.call(results.lastError, 'message'));
        assert.ok(results.lastError.help.length, 3);
        cb();
      }
    };

    return runTests({
    }, settings({
      output: false,
      src_folders,
      globals,
      desiredCapabilities: {
        browserName: 'safari',
        platformName: 'iOS',
        'safari:deviceUDID': '00008030-00024C2C3453402E',
        alwaysMatch: {
          acceptInsecureCerts: false
        }
      },
    
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // --verbose
        ]
      }
    }))
  });

  it('deviceId passed as argument - real device', async function () {
    const CliRunner = common.require('runner/cli/cli.js');
    
    const runner = new CliRunner({
      reporter: 'junit',
      env: 'mixed',
      deviceId: '00008030-00024C2C3453402E'
    });

    const globals = {
      calls: 0,
      retryAssertionTimeout: 0
    };

    await runner.setupAsync(settings({
      output: false,
      globals,
      desiredCapabilities: {
        browserName: 'safari',
        platformName: 'iOS',
        alwaysMatch: {
          acceptInsecureCerts: false
        }
      },

      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // --verbose
        ]
      }
    }));

    assert.strictEqual(runner.test_settings.desiredCapabilities['safari:deviceUDID'], '00008030-00024C2C3453402E');
    assert.strictEqual(runner.test_settings.desiredCapabilities.platformName, 'iOS');
    assert.ok(!runner.test_settings.desiredCapabilities['safari:useSimulator']);
  });

  it('error classes for mobile-web support - AndroidConnectionError', function () {
    this.timeout(10000);
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('../androidEmulator.js', class AndroidServer {
      constructor() {}

      launchEmulator() {
        return Promise.resolve();
      }

      killEmulator() {}
    });

    Transport.prototype.getDriver = function() {
      const err = new Error('unknown error: There are no devices online');
      err.name = 'SessionNotCreatedError';

      throw err;
    };

    Transport.prototype.createDriverService = async function() { 
      this.driverService = {
        getOutputFilePath(){},
        getSettingsFormatted(){}
      };
    };

    mockery.registerMock('./', Transport);
    mockery.registerMock('@nightwatch/mobile-helper', {
      getBinaryLocation(){}, getPlatformName(){}
    });

    let src_folders = [
      path.join(__dirname, '../../../sampletests/withsubfolders/simple')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError instanceof AndroidConnectionError);
        assert.ok(results.lastError.message.includes('no devices online'));
        assert.ok(Object.prototype.hasOwnProperty.call(results.lastError, 'message'));
        assert.ok(results.lastError.help.length, 4);
        cb();
      }
    };

    return runTests({}, settings({
      output: false,
      src_folders,
      globals,
      desiredCapabilities: {
        real_mobile: false,
        browserName: 'chrome',
        avd: 'dummy',
        'goog:chromeOptions': {
          androidPackage: 'com.android.chrome'
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // --verbose
        ]
      }
    }))
  });
});
