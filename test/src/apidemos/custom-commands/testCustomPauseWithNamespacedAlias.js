const assert = require('assert');
const path = require('path');
const common = require('../../../common.js');
const {settings} = common;
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const NightwatchClient = common.require('index.js');

describe('custom command with namespaced alias', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    this.server.close(function () {
      done();
    });
  });

  it('test namespaced aliases by running a custom-command', function () {
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands/testNamespacedAliases.js');
    Mocks.createNewW3CSession({
      testName: 'Test Using Namespaced Aliases'
    });

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError && !results.lastError.message.includes('First argument should be a number')) {
          throw results.lastError;
        }

        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(
          results.lastError.message,
          'Error while running "sampleNamespace.amazingPause" command: First argument should be a number.'
        );
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      silent: true,
      selenium_host: null,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands')],
      globals
    }));
  });
});
