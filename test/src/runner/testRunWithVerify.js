const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

const originalCwd = process.cwd();
const defaultSettings = {
  selenium: {
    port: 10195,
    version2: true,
    start_process: true
  },
  silent: false,
  output: false,
  output_folder: false,
};

describe('testRunWithVerify', function() {
  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  beforeEach(function(done) {
    process.chdir(path.join(__dirname, '../../sampletests/'));
    done();
  });

  afterEach(function(done) {
    process.chdir(originalCwd);
    done();
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('using verify in tests', function() {
    const settings = Object.assign({
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter(results, cb) {
          assert.ok('verifySampleFailures' in results.modules);
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 2);
          assert.strictEqual(results.assertions, 3);

          cb();
        },
      }
    }, defaultSettings);

    return NightwatchClient.runTests({
      _source: ['./withverify']
    }, settings);
  });


});
