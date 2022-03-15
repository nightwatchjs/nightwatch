const path = require('path');
const assert = require('assert');
const Globals = require('../lib/globals/commands.js');
const common = require('../common.js');
const MockServer = require('../lib/mockserver.js');

describe('Cucumber integration - parallel running single formatter', function() {
  beforeEach(function(done) {
    this.server = MockServer.init(null, {port: 10190});
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests in parallel with single formatter', function() {
    const source = [
      path.join(__dirname, './sample_cucumber_tests/parallel/testSample.js')
    ];

    const {runTests} = common.require('index.js');

    return runTests({
      source,
      parallel: true,
      verbose: false,
      timeout: 10,
      format: 'progress',
      config: path.join(__dirname, '../extra/cucumber-config-parallel.js'),
      'format-options': '',
      ['retry-interval']: 5,
      ['persist-globals']: true,
      ['webdriver-host']: 'localhost',
      ['start-process']: false,
      ['webdriver-port']: 10190
    }, {})
      .then(errorOrFailed => {
        assert.strictEqual(errorOrFailed, true);
      });
  });
});