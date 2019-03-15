const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunTestSuite', function() {

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

  afterEach(function() {
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with suiteRetries', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.equal(settings.globals.calls, 8);
        assert.deepEqual(results.errmessages, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 1);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      silent: true,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      suiteRetries: 1,
      _source: [testsPath]
    }, settings);
  });

  it('testRunner with suiteRetries and skip_testcases_on_fail=false', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.equal(settings.globals.calls, 12);
        assert.equal(results.errors, 0);
        cb();
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
      persist_globals: true,
      globals: globals,
      skip_testcases_on_fail: false,
      output_folder: false,
    };

    return NightwatchClient.runTests({
      suiteRetries: 1,
      _source: [testsPath]
    }, settings);
  });

  it('testRunner with suiteRetries and locate strategy change', function() {
    let testsPath = path.join(__dirname, '../../sampletests/suiteretries/locate-strategy');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.equal(runner.currentSuite.client.locateStrategy, 'css selector');
        cb();
      }
    };

    const Runner = common.require('runner/runner.js');
    const Settings = common.require('settings/settings.js');

    const settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      skip_testcases_on_fail: false,
      output_folder: false,
    });

    const argv = {
      reporter: 'junit',
      suiteRetries: 1,
      _source: [testsPath]
    };

    let runner = Runner.create(settings, argv);

    return Runner.readTestSource(settings, argv)
      .then(modules => {
        return runner.run(modules);
      });
  });

  it('test clear command queue when run with suiteRetries', function() {
    let testsPath = path.join(__dirname, '../../sampletests/suiteretries/sample');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.equal(globals.calls, 3);
        assert.equal(results.passed, 2);
        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      silent: true,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      suiteRetries: 1,
      _source: [testsPath]
    }, settings);
  });

  it('testRunModuleSyncName', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata : '{"using":"css selector","value":"#finlandia"}',
      response: JSON.stringify({sessionId:'1352110219202',status:0,value:[{ELEMENT: '10'}]})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/10/displayed',
      statusCode: 200,
      method: 'GET',
      response: JSON.stringify({sessionId:'1352110219202',status:0,value:true})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element',
      statusCode: 200,
      response: JSON.stringify({sessionId:'1352110219202',status:0,value: {ELEMENT: '10'}})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/10/text',
      statusCode: 200,
      method: 'GET',
      response: JSON.stringify({sessionId:'1352110219202',status:0,value:'jean sibelius'})
    }, true);

    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.ok('sampleTest' in results.modules);
        assert.strictEqual(results.errors, 0);
        if (results.lastError) {
          throw results.lastError;
        }
        cb();
      },
      afterEach(client, cb) {
        assert.equal(client.options.desiredCapabilities.name, 'Sample Test');
        cb();
      }
    };

    let testsPath = path.join(__dirname, '../../sampletests/syncnames');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      sync_test_names: true,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings);

  });

  it('test run multiple sources and same module name', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/mixed')
    ];

    let globals = {
      reporter(results, cb) {
        assert.ok('test/sample' in results.modules);
        assert.ok('mixed/sample' in results.modules);
        assert.ok('demoTest' in results.modules['test/sample'].completed);
        assert.ok('demoTestMixed' in results.modules['mixed/sample'].completed);

        cb();
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
      output_folder: false,
      start_session: true,
      src_folders: srcFolders
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRunMultipleSrcFolders', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/srcfolders')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: {
        reporter(results, cb) {
          if (results.lastError) {
            throw results.lastError;
          }
          assert.ok('test/sample' in results.modules);
          assert.ok('demoTest' in results.modules['test/sample'].completed);
          assert.ok('srcfolders/other_sample' in results.modules);
          cb();
        }
      },
      silent: true,
      output: false,
      output_folder: false,
      src_folders: srcFolders
    };

    return NightwatchClient.runTests(settings);
  });
});
