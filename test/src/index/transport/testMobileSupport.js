const assert = require('assert');
const common = require('../../../common.js');
const path = require('path');
const CommandGlobals = require('../../../lib/globals/commands.js');
const MockServer = require('../../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('MobileSupport', function () {
  beforeEach(function (done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    this.server = MockServer.init();

    this.server.on('listening', () => {
      done()
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, function () {
      Object.keys(require.cache).forEach(function (module) {
        delete require.cache[module];
      });

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
    let src_folders = [
      path.join(__dirname, '../../../sampletests/withfailures'),
      path.join(__dirname, '../../../sampletests/withsubfolders')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.ok(results.lastError instanceof Error);
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

  it('deviceId passed as argument', function () {
    let src_folders = [
      path.join(__dirname, '../../../sampletests/withsubfolders')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(results.modulesWithEnv.default['simple/sample'].sessionCapabilities['safari:deviceUDID'], '00008030-00024C2C3453402E');
        assert.strictEqual(results.modulesWithEnv.default['tags/sampleTags'].sessionCapabilities['safari:deviceUDID'], '00008030-00024C2C3453402E');
        cb();
      }
    };

    return runTests({
      deviceId: '00008030-00024C2C3453402E'
    }, settings({
      output: false,
      src_folders,
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
    })).catch(() => {});
  });

  it('deviceId passed in desiredCapabilities', function () {
    let src_folders = [
      path.join(__dirname, '../../../sampletests/withsubfolders')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(results.modulesWithEnv.default['simple/sample'].sessionCapabilities['safari:deviceUDID'], '00008030-00024C2C3453402E');
        assert.strictEqual(results.modulesWithEnv.default['tags/sampleTags'].sessionCapabilities['safari:deviceUDID'], '00008030-00024C2C3453402E');
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
    })).catch(() => {});
  });
});
