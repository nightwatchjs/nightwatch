const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

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
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunWithTags', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        waitForConditionPollInterval:10,
        waitForConditionTimeout:11,
        retryAssertionTimeout: 10,
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 3);
          assert.ok('demoTagTest' in results.modules['tags/sample'].completed);
          assert.ok('otherDemoTagTest' in results.modules['withsubfolders/tags/sampleTags'].completed);
          assert.ok('demoTest' in results.modules['withdescribe/failures/sampleSkipTestcases'].completed);
        }
      },
      tag_filter: ['login'],
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunWithTagsAndFilterEmpty', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
      },
      filter: 'syncnames/*',
      tag_filter: ['login'],
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings)
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes('No tests defined!'));
      });
  });

  it('testRunWithTagsAndFilterNotEmpty', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results) {
          assert.ok('demoTagTest' in results.modules['tags/sample'].completed);
          assert.strictEqual(Object.keys(results.modules).length, 1);
        }
      },
      filter: 'tags/*',
      tag_filter: ['login'],
      output_folder: false,
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunWithSkipTagsAndFilterNotEmpty', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results) {
          assert.ok('demoTagTest' in results.modules['tags/sample'].completed);
          assert.strictEqual(Object.keys(results.modules).length, 1);
        }
      },
      filter: '**/tags/*',
      output_folder: false,
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      skiptags: ['logout']
    }, settings);
  });

  it('testRun with filter and skiptags no matches', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results) {
        }
      },
      filter: '**/tags/*',
      output_folder: false,
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      skiptags: ['logout', 'login']
    }, settings).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No tests defined! using source folder'), err.message + '\n' + err.stack);
      assert.ok(err.detailedErr.includes('- using path filter: **/tags/*'));
      assert.ok(err.detailedErr.includes('- using skiptags filter: logout,login'));
    });
  });

  it('testRunWithTagsAndSkipTags', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    const settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 2);
          assert.ok('otherDemoTagTest' in results.modules['withsubfolders/tags/sampleTags'].completed);
        }
      },
      tag_filter: ['login'],
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      skiptags: ['other']
    }, settings);
  });

  it('testRunner with tags and skip tags no matches', function() {
    let testsPath = path.join(__dirname, '../../sampletests');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: false,
      output: false,
      globals: {},
      tag_filter: ['other'],
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      skiptags: ['login']
    }, settings).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No tests defined! using source folder'), err.message + '\n' + err.stack);
      assert.ok(err.detailedErr.includes('- using tags filter: other'));
      assert.ok(err.detailedErr.includes('- using skiptags filter: login'));
    })
  });
});
