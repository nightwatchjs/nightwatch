const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunner with page objects', function() {
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

  it('test Runner with useXpath and PO element selectors', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withpageobjects');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 0);
        assert.strictEqual(results.errors, 0);
      }
    };

    return runTests(testsPath, settings({
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
      output: false,
      globals
    }));
  });


});
