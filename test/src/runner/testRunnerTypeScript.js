const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunner', function() {
  /** @type {import("ts-node").Service} */
  let tsNode;

  before(function(done) {
    tsNode = require('ts-node').register();

    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    tsNode.enabled(false);

    this.server.close(function() {
      done();
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunSimple', function() {
    let testsPath = path.join(__dirname, '../../sampletests/typescript');
    let globals = {
      reporter(results) {
        assert.ok('sample' in results.modules);
        assert.ok('demoTest' in results.modules['sample'].completed);
        assert.strictEqual(results.modules['sample'].modulePath, path.join(__dirname, '../../sampletests/typescript/sample.ts'));

        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    });
  });
});
