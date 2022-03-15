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

  it('testCucumberSampleTests -- with expect async', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/text',
      statusCode: 200,
      method: 'GET',
      response: {
        value: 'jean sibelius'
      },
      times: 3
    });

    const source = [path.join(__dirname, './sample_cucumber_tests/withexpect/testSample.js')];

    return runTests({
      source,
      tags: ['@expect'],
      verbose: false,
      config: path.join(__dirname, '../extra/cucumber-config-expect.js')
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