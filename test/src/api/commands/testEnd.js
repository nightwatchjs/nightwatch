const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const common = require('../../../common.js');
const Nocks = require('../../../lib/nocks.js');
const nock = require('nock');

describe('end', function() {
  beforeEach(function (done) {
    Nocks.cleanAll().createSession();

    Nightwatch.init({silent : true}, client => {
      this.client = Nightwatch.client();
      this.api = this.client.api;
      done();
    });
  });

  it('client.end();', function (done) {
    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    this.api.end(function callback(result) {
      assert.equal(result.state, 'success');
      assert.strictEqual(this.api.sessionId, null);
    }.bind(this));

    this.client.start(done);
  });

  it('client.end() - no session id', function (done) {
    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .times(2)
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    this.api.end();

    this.api.end(function callback(result) {
      assert.strictEqual(result, null);
    });

    this.client.start(done);
  });

  it('client.end() - with screenshot', function (done) {
    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/screenshot')
      .reply(200, {
        status: 0,
        state: 'success',
        value: '==content'
      });

    const settings = {
      screenshots: {
        enabled: true,
        on_failure: true,
        path: './screens'
      }
    };

    const Reporter = common.require('testsuite/reporter.js');
    let reporter = new Reporter(['test case'], null, settings, {
      suiteName: 'testSuite',
      moduleKey: 'test-moduleKey',
      reportPrefix: '',
      groupName: 'test-GroupName'
    });

    Nightwatch.initClient(settings, reporter).then(client => {
      client.api.currentTest = client.reporter.currentTest;

      client.saveScreenshotToFile = function (file, content) {
        assert.equal(content, '==content');
        assert.ok(file.indexOf('screens/test_module/test_name') > -1);
        setTimeout(function () {
          done();
        }, 10);
      };

      client.api.end(function callback(result) {
        assert.equal(result.value, null);
      });

      client.start();
    });

    //client.results.failed = 1;


  });

  it('client.end() - failures and screenshots disabled', function (done) {
    const client = this.client;

    client.results.failed = 1;
    client.currentTest = {
      module: 'test_module',
      name: 'test_name'
    };
    client.options.screenshots = {
      enabled: true,
      on_failure: false,
      path: './screens'
    };

    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    this.api.end(function callback(result) {
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });
});
