const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');

describe('ensure api demos', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('run ensure api demo tests basic', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/ensure/ensure.js');
    Mocks.elementSelected();

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        host: 'localhost',
        port: 10195,
        start_process: false
      },
      output: true,
      skip_testcases_on_fail: false,
      silent: false,
      persist_globals: true,
      globals,
      output_folder: false
    });
  });

});
