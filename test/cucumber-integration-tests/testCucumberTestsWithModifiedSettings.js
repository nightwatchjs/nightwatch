const path = require('path');
const assert = require('assert');
const Globals = require('../lib/globals/commands.js');
const common = require('../common.js');
const MockServer = require('../lib/mockserver.js');
const {runTests} = common.require('index.js');

describe('Cucumber integration - with modified settings in plugin', function() {
  beforeEach(function(done) {
    this.server = MockServer.init(null, {port: 10195});
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests with browsername modified (chrome) in plugin global hook', function() {
    const source = [path.join(__dirname, './sample_cucumber_tests/with-modified-settings/testSample.js')];


    const pluginPath = [path.join(__dirname, './sample_cucumber_tests/with-modified-settings/plugin')];

    MockServer.addMock({
      url: '/wd/hub/session',
      method: 'POST',
      statusCode: 201,
      postdata: {
        capabilities: {
          firstMatch: [{}],
          alwaysMatch: {browserName: 'chrome', 'goog:chromeOptions': {}}
        }
      },
      response: {
        status: 0,
        sessionId: '1352110219202',
        value: {browserName: 'chrome', browserVersion: 'TEST_chrome'},
        state: null
      }
    }, true);


    // modify browserName to chrome in plugin global hook
    return runTests({
      source,
      tags: ['@pass'],
      verbose: false, 
      config: path.join(__dirname, '../extra/cucumber-config.js')
    }, {
      plugins: pluginPath
    })
      .then(failures => {
        assert.strictEqual(failures, false);
      });
  });

});