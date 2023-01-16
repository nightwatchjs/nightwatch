const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

const originalCwd = process.cwd();
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

  it('using verify in tests with simple failures', function() {
    return runTests({
      _source: ['./withverify/verifySampleFailures.js']
    }, settings({
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
        }
      }
    }));
  });

  it('using verify within perform in tests', function() {
    return runTests({
      _source: ['./withverify/verifyWithinPerform.js']
    }, settings({
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter(results, cb) {
          assert.ok('verifyWithinPerform' in results.modules);
          assert.strictEqual(results.passed, 0);
          assert.strictEqual(results.failed, 2);
          assert.strictEqual(results.assertions, 2);

          cb();
        }
      }
    }));
  });

});
