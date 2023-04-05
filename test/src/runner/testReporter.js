const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const rimraf = require('rimraf');

const common = require('../../common.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const {mkpath} = common.require('utils');
const {readFilePromise, readDirPromise} = require('../../lib/utils.js');

const MockServer = require('../../lib/mockserver.js');
const Reporter = common.require('reporter/global-reporter.js');

describe('testReporter', function() {

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

  it('test with unknown reporter', function() {
    const reporter = new Reporter('unknown', {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.loadReporter()
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'The custom reporter "unknown" cannot be resolved.');
      });
  });

  it('test with invalid reporter', function() {
    const custom_reporter = path.join(__dirname, '../../extra/reporter/notvalid.js');
    const reporter = new Reporter(custom_reporter, {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.loadReporter()
      .catch(err => {
        assert.strictEqual(err.message, `The custom reporter "${custom_reporter}" must have a public ".write(results, options, [callback])" method defined which should return a Promise.`);
      });
  });

  it('test with valid reporter file name', function() {

    const reporter = new Reporter(path.join(__dirname, '../../extra/reporter/custom.js'), {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    reporter.writeReport = function (reporter, globalResults) {
      Promise.resolve();
    };

    return reporter.save().then(function(result) {
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 2);
    });
  });

  it('test with valid reporter from NPM', function() {
    mockery.registerMock('nightwatch_reporter', {
      async write(results, options) {

        return 'reporter_output';
      }
    });

    const reporter = new Reporter('nightwatch_reporter', {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output',
      reporter_options: {}
    });

    return reporter.writeReportToFile().then(function(result) {
      assert.deepStrictEqual(result, ['reporter_output']);
    });
  });

  it('test run tests with multiple reporters - html + junit', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

    try {
      await runTests({
        source: testsPath,
        reporter: ['html', 'junit']
      },
      settings({
        output_folder: 'output',
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          reporter: function () {}
        },
        output: false
      }));

      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.xml`);
      await readDirPromise(`output${path.sep}nightwatch-html-report`);
    } catch (error) {
      possibleError = error;
    }

    assert.strictEqual(possibleError, null);
  });

  it('test run tests with default reporters', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

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
          reporter: function () {}
        },
        silent: true,
        output: false
      }));

      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.xml`);
      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.json`);
      await readDirPromise(`output${path.sep}nightwatch-html-report`);
    } catch (error) {
      possibleError = error;
    }

    assert.strictEqual(possibleError, null);
  });

  it('test run tests with default reporters - open the html report', async function () {
    let htmlFile;

    mockery.registerMock('open', function(filename) {
      htmlFile = filename;

      return Promise.resolve();
    });

    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

    try {
      await runTests({
        source: testsPath,
        open: true
      },
      settings({
        output_folder: 'output',
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          reporter: function () {}
        },
        silent: true,
        output: false
      }));

      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.xml`);
      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.json`);
      await readDirPromise(`output${path.sep}nightwatch-html-report`);
    } catch (error) {
      possibleError = error;
    }

    assert.strictEqual(possibleError, null);
    assert.strictEqual(htmlFile, `output${path.sep}nightwatch-html-report${path.sep}index.html`);

  });

  it('Check reporter output for varaious properties', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

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
          reporter: function (results) {
            // check for results properties
            assert.ok(Object.keys(results).includes('elapsedTime'));
            assert.ok(Object.keys(results).includes('startTimestamp'));
            assert.ok(Object.keys(results).includes('endTimestamp'));

            const module = results.modules['sample'];
            // check for module properties
            assert.ok(Object.keys(module).includes('sessionCapabilities'));
            assert.ok(Object.keys(module).includes('sessionId'));
            assert.ok(Object.keys(module).includes('projectName'));
            assert.ok(Object.keys(module).includes('buildName'));
            assert.ok(Object.keys(module).includes('startTimestamp'));
            assert.ok(Object.keys(module).includes('endTimestamp'));
            assert.ok(Object.keys(module).includes('host'));
            // check for individual test properties
            const test = module.completed['demoTest'];
            assert.ok(Object.keys(test).includes('status'));
            assert.ok(Object.keys(test).includes('startTimestamp'));
            assert.ok(Object.keys(test).includes('endTimestamp'));
            assert.strictEqual(test.status, 'pass');
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

  it('Check reporter output for commands', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

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
          reporter: function (results) {
            const module = results.modules['sample'];

            assert.ok(Object.keys(module).includes('completedSections'));

            const completedSections = module['completedSections'];

            // check for module properties
            assert.ok(Object.keys(completedSections).includes('__after_hook'));
            assert.ok(Object.keys(completedSections).includes('__before_hook'));
            assert.ok(Object.keys(completedSections).includes('__global_afterEach_hook'));
            assert.ok(Object.keys(completedSections).includes('__global_beforeEach_hook'));
            assert.ok(Object.keys(completedSections).includes('demoTest'));
            
            assert.strictEqual(completedSections['__after_hook']['commands'].length, 1);
            assert.strictEqual(completedSections['__after_hook']['commands'][0].name, 'end');

            // check for individual test properties
            const test = completedSections['demoTest'];
            assert.ok(Object.keys(test).includes('status'));
            assert.ok(Object.keys(test).includes('commands'));
            assert.strictEqual(test.commands.length, 3);
            assert.strictEqual(test.commands[0].name, 'assert.equal');
            assert.strictEqual(test.commands[1].name, 'url');
            assert.strictEqual(test.commands[2].name, 'assert.elementPresent');

            const command = test.commands[1];
            assert.ok(Object.keys(command).includes('startTime'));
            assert.ok(Object.keys(command).includes('endTime'));
            assert.ok(Object.keys(command).includes('elapsedTime'));
            assert.ok(Object.keys(command).includes('result'));
            assert.deepEqual(command.args, ['http://localhost']);
            assert.strictEqual(command.status, 'pass');
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

  it('check reporter output with appended results', async function() {
    let possibleError = null;
    const testPath = [path.join(__dirname, '../../sampletests/appendtestresult/sampleWithAppendResults.js')];
    const customCommands = [path.join(__dirname, '../../extra/commands')];

    try {
      await runTests({
        source: testPath
      }, settings({
        custom_commands_path: customCommands,
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          reporter: function (results) {
            const module = results.modules['sampleWithAppendResults'];
            
            assert.ok(Object.keys(module).includes('completedSections'));
            const completedSections = module['completedSections'];
            assert.ok(Object.keys(completedSections).includes('demoTest'));

            const test = completedSections['demoTest'];
            assert.ok(Object.keys(test).includes('customReport'));
            assert.deepStrictEqual(test.customReport, {success: true});
          }
        },
        silent: true,
        output: false
      }));
    } catch (err) {
      possibleError = err;
    }
    assert.strictEqual(possibleError, null);
  });

  it('test with multiple reporters', function() {
    mockery.registerMock('nightwatch_reporter', {
      async write(_results, _options) {

        return 'nightwatch_reporter_output';
      }
    });
    mockery.registerMock('html_reporter', {
      async write(_results, _options) {

        return 'html_reporter_output';
      }
    });

    const reporter = new Reporter('nightwatch_reporter,html_reporter', {
      globals: {
        reporter(_results, done) {
          done();
        }
      },
      output_folder: 'output',
      reporter_options: {}
    });

    return reporter.writeReportToFile().then(function(result) {
      assert.deepStrictEqual(result, ['nightwatch_reporter_output', 'html_reporter_output']);
    });
  });
});
