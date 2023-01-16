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
      done();
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

  it('error classes for mobile-web support', function () {
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
});