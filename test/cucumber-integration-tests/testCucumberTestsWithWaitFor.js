const path = require('path');
const assert = require('assert');
const Globals = require('../lib/globals/commands.js');
const common = require('../common.js');
const MockServer = require('../lib/mockserver.js');
const {runTests} = common.require('index.js');
const {settings} = common;

describe('Cucumber integration with .expect APIs', function() {
  beforeEach(function(done) {
    this.server = MockServer.init(null, {port: 10192});
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests -- with waitFor failure', function() {
    const source = [path.join(__dirname, './sample_cucumber_tests/withWaitFor/testWithFailures.js')];

    return runTests({
      source,
      tags: ['@fail'],
      verbose: false,
      config: path.join(__dirname, '../extra/cucumber-config-waitFor.js')
    }, settings({
      silent: false,
      output: false,
      globals: {
        waitForConditionTimeout: 10,
        waitForConditionPollInterval: 50
      }
    })).then(failures => {
      assert.strictEqual(failures, true, 'Cucumber should have test failures');
    });
  });

});