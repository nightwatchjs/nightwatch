const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const rimraf = require('rimraf');

const common = require('../../common.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const {mkpath} = common.require('utils');

const MockServer = require('../../lib/mockserver.js');

describe('testNightwatchEventReporter', function() {

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  beforeEach(function(done) {
    mkpath('output', function(err) {
      if (err) {
        return done(err);
      }
      mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
      done();
    });
  });


  afterEach(function(done) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    rimraf('output', done);
  });


  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('Check reporter output on real time event', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/before-after/sampleWithBeforeAndAfterNoCallback.js')];

    try {
      await runTests({
        source: testsPath
      },
      settings({
        output_folder: 'output',
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          registerEventHandlers: function(eventBroadcaster) {
            eventBroadcaster.on('TestSuiteStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults']);
            });

            eventBroadcaster.on('TestSuiteFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults']);
            });

            eventBroadcaster.on('LogCreated', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['httpOutput']);
            });

            eventBroadcaster.on('HookRunStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults', 'hook_type']);
            });

            eventBroadcaster.on('HookRunFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults', 'hook_type']);
            });

            eventBroadcaster.on('TestRunStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults']);
            });

            eventBroadcaster.on('TestRunFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults']);
            });

            eventBroadcaster.on('HookRunStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['testResults', 'hook_type']);
            });
          }
        },
        silent: true,
        output: false
      }));

    } catch (error) {
      possibleError = error;
    }
    
    assert.strictEqual(possibleError, null);
  });
});
