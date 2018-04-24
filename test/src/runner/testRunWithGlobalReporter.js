const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');

describe('testRunWithGlobalReporter', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
  });

  afterEach(function() {
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunWithGlobalReporter', function(done) {
    var testsPath = path.join(__dirname, '../../sampletests/before-after');
    var reporterCount = 0;
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter: function(results) {
          assert.ok('modules' in results);
          reporterCount++;
        }
      },
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(reporterCount, 1);
      });
  });

  it('testRunWithGlobalAsyncReporter', function(done) {
    var testsPath = path.join(__dirname, '../../sampletests/before-after');
    var reporterCount = 0;
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter: function(results, cb) {
          assert.ok('modules' in results);
          reporterCount++;
          cb();
        }
      },
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(reporterCount, 1);
      });
  });
});