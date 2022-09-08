const path = require('path');
const assert = require('assert');
const Globals = require('../lib/globals/commands.js');
const common = require('../common.js');
const MockServer = require('../lib/mockserver.js');
const {runTests} = common.require('index.js');

describe('Cucumber integration - with extras', function() {
  beforeEach(function(done) {
    this.server = MockServer.init(null, {port: 10193});
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests with disable_session_autocreate=true', function() {
    const source = [path.join(__dirname, './sample_cucumber_tests/with-extra-setup/testSample.js')];

    MockServer.addMock({
      url: '/wd/hub/session',
      method: 'POST',
      statusCode: 201,
      postdata: {
        desiredCapabilities: {
          browserName: 'firefox',
          name: 'Sample Scenario',
          testCap: 'testing'
        },
        capabilities: {alwaysMatch: {browserName: 'firefox'}}
      },
      response: {
        status: 0,
        sessionId: '1352110219202',
        value: {browserName: 'firefox', browserVersion: 'TEST_firefox'},
        state: null
      }
    }, true);

    return runTests({
      source,
      tags: ['@pass'],
      verbose: false,
      config: path.join(__dirname, '../extra/cucumber-config-noautostart.js'),
      require: path.join(__dirname, './sample_cucumber_tests/with-extra-setup/_extra_setup.js')
    }, {})
      .then(failures => {
        assert.strictEqual(failures, false);
      });
  });

});