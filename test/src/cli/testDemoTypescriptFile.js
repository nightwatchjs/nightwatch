const path = require('path');
const MockServer = require('../../lib/mockserver.js');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Utils = common.require('utils');

describe('Typescript demos', function () {
  const oldLoadTSNode = Utils.loadTSNode;
  let tsNode;

  before(function(done) {
    Utils.loadTSNode = function(projectTsFile) {
      
      tsNode = require('ts-node').register({
        esm: false,
        project: projectTsFile
      });
      
    };
    done();
  });

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

  after(function(done) {
    if (tsNode) {
      tsNode.enabled(false);
    }
    Utils.loadTSNode = oldLoadTSNode;
    done();
  });

  it('run basic typescript tests', function () {
    this.timeout(5000);
    const testsPath = path.join(__dirname, '../../typescript-tests/demo.ts');
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../typescript-tests'));

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
    }).then(() => {
      process.chdir(originalCwd);
    }).catch(() => {
      process.chdir(originalCwd);
    });
  });
});
