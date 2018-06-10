const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunWithMultipleSources', function() {
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

  it('testRunWithMultipleSourceFiles', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/test/sample.js'),
      path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js')
    ];
    let globals = {
      calls: 0,
      reporter(results) {
        assert.equal(globals.calls, 7);
        assert.equal(Object.keys(results.modules).length, 2);
        assert.ok('sample' in results.modules);
        assert.ok('sampleSingleTest' in results.modules);
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: globals,
      persist_globals: true,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunWithSourceFilesAndFolders', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/test/sample.js'),
      path.join(__dirname, '../../sampletests/before-after/')
    ];

    let globals = {
      calls: 0,
      reporter(results) {
        assert.equal(globals.calls, 19);
        assert.equal(Object.keys(results.modules).length, 4);
        assert.ok('sample' in results.modules);
        assert.ok('sampleSingleTest' in results.modules);
        assert.ok('sampleWithBeforeAndAfter' in results.modules);
        assert.ok('syncBeforeAndAfter' in results.modules);
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: globals,
      persist_globals: true,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner with multiple src_folders value', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/'),
      path.join(__dirname, '../../sampletests/simple/')
    ];

    let globals = {
      calls: 0,
      reporter(results) {
        assert.ok('async/test/sample' in results.modules);
        assert.ok('simple/test/sample' in results.modules);
        assert.equal(Object.keys(results.modules).length, 2);
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      src_folders: testsPath,
      silent: false,
      output: false,
      globals: globals,
      persist_globals: true,
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRunner with multiple src_folders value - with unit tests error', function() {
    const mockery = require('mockery');
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('../process-listener.js', function() {
      this.setTestRunner = function() {};
      this.onuncaught = function(err) {};
    });

    let uncaughtErr = null
    process.on('uncaughtException', function(err) {
      uncaughtErr = err;
    });

    const Client = common.require('index.js');

    let testsPath = [
      path.join(__dirname, '../../sampletests/async/'),
      path.join(__dirname, '../../sampletests/unittests/')
    ];

    let globals = {
      calls: 0,
      reporter(results) {
        assert.ok('test/sample' in results.modules);
        assert.ok('unittests/sample' in results.modules);
        assert.ok('unittests/sampleAnnotation' in results.modules);
        assert.equal(Object.keys(results.modules).length, 3);
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      src_folders: testsPath,
      silent: true,
      output: false,
      globals: globals,
      persist_globals: true,
      output_folder: false
    };

    return Client.runTests(settings).then(_ => {
      mockery.deregisterAll();
      mockery.disable();
      assert.ok(uncaughtErr instanceof TypeError);
    });
  });
});
