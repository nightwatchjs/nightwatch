const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const Globals = require('../../lib/globals.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunner', function() {
  const emptyPath = path.join(__dirname, '../../sampletests/empty/testdir');

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      fs.mkdir(emptyPath, function(err) {
        if (err) {
          return done();
        }
        done();
      });
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      fs.rmdir(emptyPath, function(err) {
        if (err) {
          return done();
        }
        done();
      });
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunEmptyFolder', function(done) {
    Globals
      .startTestRunner(emptyPath, {
        output_folder: false
      })
      .catch(err => {
        assert.ok(err instanceof Error);
        if (err.message !== `No tests defined! using source folder: ${emptyPath}`) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('testRunEmptySubFolder', function(done) {
    let testsPath = path.dirname(emptyPath);

    Globals
      .startTestRunner(testsPath, {
        output_folder: false
      })
      .catch(err => {
        assert.ok(err instanceof Error);
        if (err.message !== `No tests defined! using source folder: ${testsPath}`) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('testRunNoSrcFoldersArgument', function() {
    let settings = Settings.parse({
      output_folder: false
    });

    assert.throws(function() {
      Runner.readTestSource(settings);
    }, /No test source specified, please check "src_folders" config/);
  });

  it('testRunSimple', function() {
    let testsPath = path.join(__dirname, '../../sampletests/simple');
    let globals = {
      reporter(results) {
        assert.ok(`test${path.sep}sample` in results.modules);
        assert.ok('demoTest' in results.modules[`test${path.sep}sample`].completed);

        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('readTestSource with glob pattern', async function(){
    const modules =  await Runner.readTestSource({
      src_folders: [path.join(__dirname, '../../sampletests/srcfolders/*.js')]
    },  {});
    assert.deepStrictEqual(modules, [path.join(__dirname, '../../sampletests/srcfolders/other_sample.js')]);
  });

  it('readTestSource with glob pattern and normal folder', async function(){
    const modules =  await Runner.readTestSource({
      src_folders: [path.join(__dirname, '../../sampletests/srcfolders/*.js'), path.join(__dirname, '../../sampletests/async/')]
    },  {});
    assert.deepStrictEqual(modules, [path.join(__dirname, '../../sampletests/srcfolders/other_sample.js'), path.join(__dirname, '../../sampletests/async/test/sample.js')]);
  });

  it('readTestSource with glob pattern that matches no file', async  function(){
    await assert.rejects(async function() {
      await Runner.readTestSource({
        src_folders: [path.join(__dirname, '../../sampletests/srcfolders/nightwatch/*.js')]
      },  {});
    }, 'Should be rejected');
  });
});
