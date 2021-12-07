const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerMixedFiles', function() {
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

  it('testRunWithoutDisablingTypescriptExplicitly', function() {
    let testsPath = path.join(__dirname, '../../sampletests/mixed-files');
    let globals = {
      reporter({lastError, errmessages, modules}) {
        if (lastError) {
          throw lastError;
        }
  
        if (errmessages.length) {
          throw new Error(errmessages[0]);
        }
  
        assert.ok('sampleJs' in modules);
        assert.ok('sampleTs' in modules);
        assert.strictEqual(modules['sampleJs'].modulePath, path.join(__dirname, '../../sampletests/mixed-files/sampleJs.js'));
        assert.strictEqual(modules['sampleTs'].modulePath, path.join(__dirname, '../../sampletests/mixed-files/sampleTs.ts'));
      }
    };

    return runTests(testsPath, settings({
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      globals,
      output: false,
      disable_typescript: false
    }));
  });

  it('testRunWithoutDisablingTypescriptImplicitly', function() {
    let testsPath = path.join(__dirname, '../../sampletests/mixed-files');
    let globals = {
      reporter({lastError, errmessages, modules}) {
        if (lastError) {
          throw lastError;
        }
  
        if (errmessages.length) {
          throw new Error(errmessages[0]);
        }
  
        assert.ok('sampleJs' in modules);
        assert.ok('sampleTs' in modules);
        assert.strictEqual(modules['sampleJs'].modulePath, path.join(__dirname, '../../sampletests/mixed-files/sampleJs.js'));
        assert.strictEqual(modules['sampleTs'].modulePath, path.join(__dirname, '../../sampletests/mixed-files/sampleTs.ts'));
      }
    };

    return runTests(testsPath, settings({
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      globals
    }));
  });

  it('testRunSimpleDisablingTypescript', function() {
    let testsPath = path.join(__dirname, '../../sampletests/mixed-files');
    let globals = {
      reporter({lastError, errmessages, modules}) {
        if (lastError) {
          throw lastError;
        }

        if (errmessages.length) {
          throw new Error(errmessages[0]);
        }

        assert.ok('sampleJs' in modules);
        assert.strictEqual(typeof(modules['sampleTs']), 'undefined');
        assert.strictEqual(modules['sampleJs'].modulePath, path.join(__dirname, '../../sampletests/mixed-files/sampleJs.js'));
      }
    };

    return runTests(testsPath, settings({
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      globals,
      disable_typescript: true
    }));
  }); 
});
