const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerTypeScript', function() {
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

  this.timeout(5000);

  it('testRunSimple', function() {
    let testsPath = path.join(__dirname, '../../sampletests/typescript');
    let globals = {
      reporter({lastError, errmessages, modules}) {
        if (lastError) {
          throw lastError;
        }

        if (errmessages.length) {
          throw new Error(errmessages[0]);
        }

        assert.ok('sample' in modules);
        assert.ok('demoTest' in modules['sample'].completed);
        assert.strictEqual(modules['sample'].modulePath, path.join(__dirname, '../../sampletests/typescript/sample.ts'));
      }
    };

    return runTests(testsPath, settings({
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      globals
    }));
  });
});
