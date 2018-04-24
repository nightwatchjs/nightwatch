const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');
const Globals = require('../../lib/globals.js');

describe('testRunWithExclude', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithExcludeFolder', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/withexclude');
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      exclude: ['excluded'],
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok(!('excluded-module' in runner.results.modules));
        assert.ok(!('not-excluded' in runner.results.modules));
      });
  });

  it('testRunWithExcludePattern', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/withexclude');

    let testPattern = path.join('excluded', 'excluded-*');
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      exclude: [testPattern]
    }, {
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok(!('excluded-module' in runner.results.modules));
      });

  });

  it('testRunWithExcludeFile', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/withexclude');
    let testPattern = path.join('excluded', 'excluded-module.js');

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      exclude: [testPattern]
    }, {
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok(!('excluded-module' in runner.results.modules));
        assert.ok('not-excluded' in runner.results.modules);
      });
  });
});