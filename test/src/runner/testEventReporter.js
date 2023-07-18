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

    const eventExecuted = {
      TestSuiteStarted: false,
      TestSuiteFinished: false,
      BeforeStarted: false,
      BeforeFinished: false,
      TestRunStarted: false,
      TestRunFinished: false,
      AfterStarted: false,
      AfterFinished: false,
      LogCreated: false,
      AfterEachFinished: false,
      AfterEachStarted: false
    };

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
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata']);
              eventExecuted.TestSuiteStarted = true;
            });
            
            eventBroadcaster.on('TestSuiteFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata']);
              eventExecuted.TestSuiteFinished = true;
            });
            
            eventBroadcaster.on('BeforeStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata']);
              eventExecuted.BeforeStarted = true;
            });
            
            eventBroadcaster.on('BeforeFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata']);
              assert.ok(Object.prototype.hasOwnProperty.call(args['envelope'], '__before_hook'));
              eventExecuted.BeforeFinished = true;
            });
            
            eventBroadcaster.on('TestRunStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata', 'testcase']);
              eventExecuted.TestRunStarted = true;
            });
            
            eventBroadcaster.on('TestRunFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata', 'testcase']);
              eventExecuted.TestRunFinished = true;
            });
            
            eventBroadcaster.on('AfterStarted', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata']);
              eventExecuted.AfterStarted = true;
            });
            
            eventBroadcaster.on('AfterFinished', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['envelope', 'metadata']);
              eventExecuted.AfterFinished = true;
            });
            
            eventBroadcaster.on('LogCreated', (args) => {
              assert.deepStrictEqual(Object.keys(args), ['httpOutput']);
              eventExecuted.LogCreated = true;
            });            
          }
        },
        silent: true,
        output: false
      }));

      assert.strictEqual(eventExecuted.AfterFinished, true);
      assert.strictEqual(eventExecuted.AfterStarted, true);
      assert.strictEqual(eventExecuted.BeforeFinished, true);
      assert.strictEqual(eventExecuted.BeforeStarted, true);
      assert.strictEqual(eventExecuted.LogCreated, true);
      assert.strictEqual(eventExecuted.TestRunFinished, true);
      assert.strictEqual(eventExecuted.TestRunStarted, true);
      assert.strictEqual(eventExecuted.AfterEachFinished, false);
      assert.strictEqual(eventExecuted.AfterEachStarted, false);
      assert.strictEqual(eventExecuted.TestSuiteFinished, true);
      assert.strictEqual(eventExecuted.TestSuiteStarted, true);
    } catch (error) {
      possibleError = error;
    }
    
    assert.strictEqual(possibleError, null);
  });
});
