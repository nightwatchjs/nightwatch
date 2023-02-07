const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const common = require('../../../common.js');
const MockServer = require('../../../lib/mockserver.js');
const {runTests} = common.require('index.js');

describe('Cucumber integration', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests', function() {
    const source = [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')];

    return runTests({
      source,
      tags: ['@pass'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, {}).then(failures => {
      assert.strictEqual(failures, false, 'Cucumber has test failures. Run with verbose to investigate.');
    });
  });

  it('testCucumberSampleTests with failures', function() {
    const source = [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testWithFailures.js')];

    return runTests({
      source,
      tags: ['@fail'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, {}).then(failures => {
      assert.strictEqual(failures, true, 'Cucumber tests should have failed. Run with verbose to investigate.');
    });
  });

  it('testCucumberSampleTests - chaining of commands failure', function() {
    const source = [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/chainingCommands/testCommands.js')];

    return runTests({
      source,
      tags: ['@fail'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, {}).then(failures => {
      assert.strictEqual(failures, true, 'Cucumber has test failures. Run with verbose to investigate.');
    });
  });


  it('testCucumberSampleTests - use custom commands failure', function() {
    const source = [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/customCommands/testCucumberWithCustomWait.js')];

    return runTests({
      source,
      tags: ['@fail'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, {})
      .then(failures => {
        assert.strictEqual(failures, true, 'Cucumber has test failures. Run with verbose to investigate.');
      });
  });
});