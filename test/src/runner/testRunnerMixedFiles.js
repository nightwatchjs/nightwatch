const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

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
    let testsPath = path.join(__dirname, '../../sampletests/mixedFiles');
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
        assert.strictEqual(modules['sampleJs'].modulePath, path.join(__dirname, '../../sampletests/mixedFiles/sampleJs.js'));
        assert.strictEqual(modules['sampleTs'].modulePath, path.join(__dirname, '../../sampletests/mixedFiles/sampleTs.ts'));
      }
    };
  

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      output: false,
      silent: false,
      persist_globals: true,
      globals,
      output_folder: false,
      disable_typescript: false
    });
  });

  it('testRunWithoutDisablingTypescriptImplicitly', function() {
    let testsPath = path.join(__dirname, '../../sampletests/mixedFiles');
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
        assert.strictEqual(modules['sampleJs'].modulePath, path.join(__dirname, '../../sampletests/mixedFiles/sampleJs.js'));
        assert.strictEqual(modules['sampleTs'].modulePath, path.join(__dirname, '../../sampletests/mixedFiles/sampleTs.ts'));
      }
    };
  

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      output: false,
      silent: false,
      persist_globals: true,
      globals,
      output_folder: false
    });
  });


  it('testRunSimpleDisablingTypescript', function() {
    let testsPath = path.join(__dirname, '../../sampletests/mixedFiles');
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
        assert.strictEqual(modules['sampleJs'].modulePath, path.join(__dirname, '../../sampletests/mixedFiles/sampleJs.js'));
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      output: false,
      silent: false,
      persist_globals: true,
      globals,
      output_folder: false,
      disable_typescript: true
    });
  }); 
});
