const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const common = require('../../../common.js');
const MockServer = require('../../../lib/mockserver.js');
const {runTests} = common.require('index.js');

describe('Cucumber integration - parallel running', function() {
  beforeEach(function(done) {
    let moduleKeys = Object.keys(require.cache).filter(item => (item.includes('_setup_cucumber_runner')));

    moduleKeys.forEach(item => {
      delete require.cache[item];
    });

    moduleKeys = Object.keys(require.cache).filter(item => item.includes('cucumbertests/'));
    moduleKeys.forEach(item => {
      delete require.cache[item];
    });

    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests in parallel with single formatter', function() {
    const source = [
      path.join(__dirname, '../../../cucumbertests/testSample.js')
    ];

    return runTests({
      source,
      parallel: true,
      verbose: false,
      timeout: 10,
      format: 'progress',
      config: path.join(__dirname, '../../../extra/cucumber-config.js'),
      'format-options': '',
      ['retry-interval']: 5,
      ['persist-globals']: true,
      ['webdriver-host']: 'localhost',
      ['start-process']: false,
      ['webdriver-port']: 10195
    }, {})
      .then(errorOrFailed => {
        assert.strictEqual(errorOrFailed, true);
      });
  });

  it('testCucumberSampleTests in parallel with multiple formatters', function() {
    const source = [
      path.join(__dirname, '../../../cucumbertests/testSample.js')
    ];

    return runTests({
      source,
      parallel: true,
      verbose: false,
      timeout: 10,
      format: ['progress', 'usage'],
      config: path.join(__dirname, '../../../extra/cucumber-config.js'),
      'format-options': '',
      ['retry-interval']: 5,
      ['persist-globals']: true,
      ['webdriver-host']: 'localhost',
      ['start-process']: false,
      ['webdriver-port']: 10195
    }, {})
      .then(errorOrFailed => {
        assert.strictEqual(errorOrFailed, true);
      });
  });
});