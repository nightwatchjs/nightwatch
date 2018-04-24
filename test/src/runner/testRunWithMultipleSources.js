const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');

describe('testRunWithMultipleSources', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithMultipleSourceFiles', function(done) {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/sample.js'),
      path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js')
    ];
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: globals,
      persist_globals: true,
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 7);
        assert.equal(Object.keys(runner.results.modules).length, 2);
        assert.ok('sample' in runner.results.modules);
        assert.ok('sampleSingleTest' in runner.results.modules);
      });

  });

  it('testRunWithSourceFilesAndFolders', function(done) {
    let testsPath = [
      path.join(__dirname, '../../sampletests/async/sample.js'),
      path.join(__dirname, '../../sampletests/before-after/')
    ];

    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: globals,
      persist_globals: true,
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 12);
        assert.equal(Object.keys(runner.results.modules).length, 4);
        assert.ok('sample' in runner.results.modules);
        assert.ok('sampleSingleTest' in runner.results.modules);
        assert.ok('sampleWithBeforeAndAfter' in runner.results.modules);
        assert.ok('syncBeforeAndAfter' in runner.results.modules);
      });
  });
});
