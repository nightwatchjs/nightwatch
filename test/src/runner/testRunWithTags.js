const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');

describe('testRunWithTags', function() {
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

  it('testRunWithTags', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      tag_filter: ['login'],
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
        assert.equal(Object.keys(runner.results.modules).length, 2);
        assert.equal(('demoTagTest' in runner.results.modules.sample.completed), true);
        assert.equal(('otherDemoTagTest' in runner.results.modules.sampleTags.completed), true);
      });
  });

  it('testRunWithTagsAndFilterEmpty', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      filter: 'syncnames/*',
      tag_filter: ['login'],
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
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.startsWith('No tests defined!'));
      });
  });

  it('testRunWithTagsAndFilterNotEmpty', function() {
      let testsPath = path.join(__dirname, '../../sampletests');

      let settings = Settings.parse({
        selenium: {
          port: 10195,
          version2: true,
          start_process: true
        },
        silent: true,
        output: false,
        globals: {},
        filter: 'tags/*',
        tag_filter: ['login']
      }, {
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
          assert.ok(('demoTagTest' in runner.results.modules.sample.completed), 'demoTagTest was ran');
        });
    });

    it('testRunWithTagsAndSkipTags', function() {
      let testsPath = path.join(__dirname, '../../sampletests');

      let settings = Settings.parse({
        selenium: {
          port: 10195,
          version2: true,
          start_process: true
        },
        silent: true,
        output: false,
        globals: {},
        tag_filter: ['login'],
        output_folder: false,
        start_session: true
      });

      let runner = Runner.create(settings, {
        reporter: 'junit',
        skipTags: ['other']
      });

      return Runner.readTestSource(testsPath, settings)
        .then(modules => {
          return runner.run(modules);
        })
        .then(_ => {
          assert.equal(Object.keys(runner.results.modules).length, 1);
          assert.ok(('otherDemoTagTest' in runner.results.modules.sampleTags.completed));
        });
    });

  it('testRunWithTagsAndSkipTagsNoMatches', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      tag_filter: ['other'],

      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit',
      skiptags: ['login']
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(runner.results.errmessages.length, 0);
        assert.equal(runner.results, false);
      });
  });
});