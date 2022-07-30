const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const {loadTSNode} = require('../../../../lib/utils');

describe('Typescript demos', function () {
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

  it('run basic typescript tests', function () {
    this.timeout(3000);
    const testsPath = path.join(__dirname, '../../../apidemos/typescript/demo.ts');

    const projectTsFile = path.join(__dirname, '../../../apidemos/typescript/tsconfig.json');
    loadTSNode(projectTsFile);

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
      output: false,
      skip_testcases_on_fail: false,
      silent: true,
      persist_globals: true,
      globals,
      output_folder: false
    });
  });
});
