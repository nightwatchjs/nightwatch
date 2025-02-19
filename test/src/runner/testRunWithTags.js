const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const { settings } = common;
const { runTests } = common.require('index.js');

describe('testRunWithTags', function() {
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
    Object.keys(require.cache).filter(i => i.includes('/sampletests')).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with tags', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests({
      _source: [testsPath],
      tag: ['browser']
    }, settings({
      output: false,
      disable_typescript: true,
      globals: {
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 1);
          assert.ok('demoTagTest' in results.modules[`tagswithbrowserobject${path.sep}sample`].completed);
        }
      }
    })).catch(err => {
      assert.fail(`Test failed with error: ${err.message}`);
    });
  });

  it('testRunWithTags', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests(testsPath, settings({
      output: false,
      disable_typescript: true,
      globals: {
        waitForConditionPollInterval: 10,
        waitForConditionTimeout: 11,
        retryAssertionTimeout: 10,
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 3);
          assert.ok('demoTagTest' in results.modules[`tags${path.sep}sample`].completed);
          assert.ok('otherDemoTagTest' in results.modules[`withsubfolders${path.sep}tags${path.sep}sampleTags`].completed);
          assert.ok('demoTest' in results.modules[`withdescribe${path.sep}failures${path.sep}sampleSkipTestcases`].completed);
        }
      },
      tag_filter: ['login']
    })).catch(err => {
      assert.fail(`Test failed with error: ${err.message}`);
    });
  });

  it('testRunWithTagsAndFilterEmpty', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests(testsPath, settings({
      globals: {},
      filter: 'syncnames/*',
      tag_filter: ['login']
    })).catch(err => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No tests defined!'));
    });
  });

  it('testRunWithTagsAndFilterNotEmpty', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests(testsPath, settings({
      globals: {
        reporter(results) {
          assert.ok('demoTagTest' in results.modules[`tags${path.sep}sample`].completed);
          assert.strictEqual(Object.keys(results.modules).length, 1);
        }
      },
      filter: 'tags/*',
      tag_filter: ['login']
    })).catch(err => {
      assert.fail(`Test failed with error: ${err.message}`);
    });
  });

  it('testRunWithSkipTagsAndFilterNotEmpty', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests({
      _source: [testsPath],
      skiptags: ['logout']
    }, settings({
      globals: {
        reporter(results) {
          assert.ok('demoTagTest' in results.modules[`tags${path.sep}sample`].completed);
          assert.strictEqual(Object.keys(results.modules).length, 1);
        }
      },
      filter: '**/tags/*'
    })).catch(err => {
      assert.fail(`Test failed with error: ${err.message}`);
    });
  });

  it('testRun with filter and skiptags no matches', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests({
      _source: [testsPath],
      skiptags: ['logout', 'login']
    }, settings({
      globals: {
        reporter(results) {}
      },
      filter: '**/tags/*'
    })).catch(err => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No tests defined! using source folder'), err.message + '\n' + err.stack);
      assert.ok(err.detailedErr.includes('- using path filter: **/tags/*'));
      assert.ok(err.detailedErr.includes('- using skiptags filter: logout,login'));
    });
  });

  it('testRunWithTagsAndSkipTags', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests({
      _source: [testsPath],
      skiptags: ['other']
    }, settings({
      output: false,
      disable_typescript: true,
      globals: {
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 2);
          assert.ok('otherDemoTagTest' in results.modules[`withsubfolders${path.sep}tags${path.sep}sampleTags`].completed);
        }
      },
      tag_filter: ['login']
    })).catch(err => {
      assert.fail(`Test failed with error: ${err.message}`);
    });
  });

  it('testRunner with tags and skip tags no matches', function() {
    const testsPath = path.join(__dirname, '../../sampletests');

    return runTests({
      _source: [testsPath],
      skiptags: ['login']
    }, settings({
      globals: {},
      output: false,
      tag_filter: ['other']
    })).catch(err => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No tests defined! using source folder'), err.message + '\n' + err.stack);
      assert.ok(err.detailedErr.includes('- using tags filter: other'));
      assert.ok(err.detailedErr.includes('- using skiptags filter: login'));
    });
  });
});
