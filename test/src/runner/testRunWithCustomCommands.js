const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');
const Logger = common.require('util/logger.js');

describe('testRunWithCustomCommands', function() {

  //Logger.enable();
  //Logger.setOutputEnabled(true);

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

  afterEach(function() {
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with custom command which has failures', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withcustomcommands');
    let globals = {
      increment: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.equal(settings.globals.increment, 2);
        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      silent: false,
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings);
  });
});
