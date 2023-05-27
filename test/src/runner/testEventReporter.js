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
          onEvent: function({eventName, ...args}) {
            assert.ok(['GlobalHookRunStarted',
              'GlobalHookRunFinished',
              'TestSuiteStarted',
              'TestSuiteFinished',
              'HookRunStarted',
              'HookRunFinished',
              'TestRunStarted',
              'TestRunFinished',
              'LogCreated'].includes(eventName));

            switch (eventName) {
              case 'TestSuiteStarted':
                assert.deepStrictEqual(Object.keys(args), ['testResults']);
                break;

              case 'TestSuiteFinished':
                assert.deepStrictEqual(Object.keys(args), ['testResults']);
                break;
        
              case 'LogCreated':
                assert.deepStrictEqual(Object.keys(args), ['httpOutput']);
                break;

              case 'HookRunStarted':
                assert.deepStrictEqual(Object.keys(args), ['testResults', 'hook_type']);
                break;
            
              case 'HookRunFinished':
                assert.deepStrictEqual(Object.keys(args), ['testResults', 'hook_type']);
                break;

              case 'TestRunStarted':
                assert.deepStrictEqual(Object.keys(args), ['testResults']);
                break;
            
              case 'TestRunFinished':
                assert.deepStrictEqual(Object.keys(args), ['testResults']);
                break;
            }
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
