const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

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
        assert.strictEqual(globals.calls, 7);
        assert.strictEqual(Object.keys(results.modules).length, 2);
        assert.ok('sample' in results.modules);
        assert.ok('sampleSingleTest' in results.modules);
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('testRunWithSourceFilesAndFolders', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/test/sample.js'),
      path.join(__dirname, '../../sampletests/before-after/')
    ];

    let globals = {
      calls: 0,
      reporter(results) {
        assert.strictEqual(globals.calls, 21);
        assert.strictEqual(Object.keys(results.modules).length, 5);
        assert.ok('sample' in results.modules);
        assert.ok('sampleSingleTest' in results.modules);
        assert.ok('sampleWithBeforeAndAfter' in results.modules);
        assert.ok('syncBeforeAndAfter' in results.modules);
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('testRunner with multiple src_folders value', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/'),
      path.join(__dirname, '../../sampletests/simple/')
    ];

    let globals = {
      calls: 0,
      reporter(results) {
        assert.ok(`async${path.sep}test${path.sep}sample` in results.modules);
        assert.ok(`simple${path.sep}test${path.sep}sample` in results.modules);
        assert.strictEqual(Object.keys(results.modules).length, 2);
      }
    };

    return runTests(settings({
      src_folders: testsPath,
      globals
    }));
  });

  it('testRunner with multiple src_folders value - with unit tests error', function() {
    const mockery = require('mockery');
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('../process-listener.js', function() {
      this.setTestRunner = function() {};
      this.onuncaught = function(err) {};
    });

    let uncaughtErr = null;
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
        assert.ok(`test${path.sep}sample` in results.modules);
        assert.ok(`unittests${path.sep}sample` in results.modules);
        assert.ok(`unittests${path.sep}sampleAnnotation` in results.modules);
        assert.strictEqual(Object.keys(results.modules).length, 3);
      }
    };

    return Client.runTests(settings({
      src_folders: testsPath,
      globals
    })).then(_ => {
      mockery.deregisterAll();
      mockery.disable();
      assert.ok(uncaughtErr instanceof TypeError);
    });
  });
});
