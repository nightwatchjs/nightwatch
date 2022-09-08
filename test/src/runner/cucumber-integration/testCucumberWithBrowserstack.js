const path = require('path');
const assert = require('assert');
const nock = require('nock');
const common = require('../../../common.js');
const {runTests} = common.require('index.js');

xdescribe('Cucumber  Browserstack integration', function() {
  
  before(function(done) {
    try {
      nock.activate();
    // eslint-disable-next-line no-empty
    } catch (err) {
    }
   
    nock('https://hub-cloud.browserstack.com')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'chrome'
        }
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
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: [{
          'ELEMENT': '0'
        }]
      });

    nock('https://hub-cloud.browserstack.com')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        value: []
      });

    done();
  });

  after(function(done) {
    nock.restore();
    done();
  });


  it('testCucumberSampleTests - [Passed]', function() {
   
    nock('https://api.browserstack.com')
      .put('/automate/sessions/1352110219202.json', body => body.status === 'passed')
      .reply(200);

    const source = [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')];
    
    return runTests({
      source,
      tags: ['@pass'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js'),
      env: 'browserstack'
    }, {}).then(failures => {
      assert.strictEqual(failures, false, 'Cucumber has test failures. Run with verbose to investigate.');
    });
  });

  it('testCucumberSampleTests with failures', function() {


    nock('https://api.browserstack.com')
      .put('/automate/sessions/1352110219202.json', body => body.status === 'failed')
      .reply(200);
    
    const source = [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testWithFailures.js')];
    
    return runTests({
      source,
      env: 'browserstack',
      tags: ['@fail'],
      verbose: false,
      config: path.join(__dirname, '../../../extra/cucumber-config.js')
    }, {}).then(failures => {
      assert.strictEqual(failures, true, 'Cucumber tests should have failed. Run with verbose to investigate.');
    });
  });
});

