const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunWithExternalGlobals', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRun with external globals', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js');
    const globals = {
      reporterCount: 0
    };

    return runTests(testsPath, settings({
      globals,
      globals_path: path.join(__dirname, '../../extra/external-globals.js'),

      output_folder: false
    }));
  });

  it('testRun with async external globals', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js');
    const globals = {
      reporterCount: 0
    };

    return runTests(testsPath, settings({
      globals,
      globals_path: path.join(__dirname, '../../extra/external-globals-async.js'),
      output_folder: false
    }));
  });
});
