const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const common = require('../../../common.js');
const MockServer = require('../../../lib/mockserver.js');
const {runTests} = common.require('index.js');
const {settings} = common;

describe('Cucumber integration', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  xit('testCucumberSampleTests -- with expect async', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/text',
      statusCode: 200,
      method: 'GET',
      response: {
        value: 'jean sibelius'
      },
      times: 3
    });

    const source = [path.join(__dirname, '../../../cucumbertests/testSample.js')];

    return runTests({
      source,
      tags: ['@expect'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, settings({
      silent: false,
      output: false,
      globals: {
        waitForConditionTimeout: 10,
        waitForConditionPollInterval: 50,
      },
    })).then(failures => {
      assert.strictEqual(failures, true, 'Cucumber should have test failures');
    });
  });

  it('testCucumberSampleTests', function() {
    const source = [path.join(__dirname, '../../../cucumbertests/testSample.js')];

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
    const source = [path.join(__dirname, '../../../cucumbertests/testWithFailures.js')];

    return runTests({
      source,
      tags: ['@fail'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, {}).then(failures => {
      assert.strictEqual(failures, true, 'Cucumber tests should have failed. Run with verbose to investigate.');
    });
  });

});