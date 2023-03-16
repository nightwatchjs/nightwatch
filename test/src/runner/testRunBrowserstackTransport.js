const path = require('path');
const assert = require('assert');
const nock = require('nock');
const common = require('../../common.js');

const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunBrowserstackTransport', function() {
  let nockDone = false;

  before(function(done) {
    try {
      nock.activate();
      // eslint-disable-next-line no-empty
    } catch (err) {}

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, (uri, requestBody) => {
        assert.ok(requestBody.capabilities.alwaysMatch['bstack:options'].sessionName, 'session request should contain session Name');
        
        return {
          status: 0,
          sessionId: '1352110219202',
          value: {
            browserName: 'chrome'
          }
        };
      });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, []);

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session/1352110219202/url')
      .reply(200, {
        value: null
      });

    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session/1352110219202/elements')
      .times(5)
      .reply(200, {
        value: []
      });

    nock('https://hub-cloud.browserstack.com')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        value: []
      });

    nock('https://api.browserstack.com')
      .put('/automate/sessions/1352110219202.json', {
        status: 'failed',
        reason: /^NightwatchAssertError: Testing if element <#weblogin> is present in 10ms/
      })
      .reply(200, function() {
        nockDone = true;

        return {};
      });

    done();
  });

  after(function(done) {
    nock.restore();
    done();
  });

  it('run with error', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withfailures/');

    return runTests(testsPath, settings({
      output: false,
      silent: false,
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'bstack:options': {
          'userName': 'test-access-user',
          'accessKey': 'test-access-key'
        },
        browserName: 'chrome'
      },
      globals: {
        waitForConditionPollInterval: 10,
        waitForConditionTimeout: 11,
        retryAssertionTimeout: 10,
        reporter(results) {
          assert.ok(nockDone, 'Failed mock requests');
          assert.strictEqual(Object.keys(results.modules).length, 1);
        }
      }
    }));
  });

});
