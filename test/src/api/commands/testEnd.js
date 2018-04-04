const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
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

    this.api.end(result => {
      assert.equal(result.state, 'success');
      assert.strictEqual(this.api.sessionId, null);
    });

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

    Nightwatch.initClient({
      screenshots: {
        enabled: true,
        on_failure: true,
        path: './screens'
      }
    }).then(client => {
      client.api.currentTest = {
        module: 'test_module',
        name: 'test_name',
        results: {
          failed: 1,
          passed: 0
        }
      };

      client.api.saveScreenshot = function (file, callback) {
        assert.ok(file.indexOf('screens/test_module/test_name') > -1);
      };

      client.api.end(function callback(result) {
        assert.equal(result.value, null);
      });

      client.start(done);
    });
  });

  it('client.end() - failures and screenshots disabled', function (done) {
    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    Nightwatch.initClient({
      screenshots: {
        enabled: true,
        on_failure: false,
        path: './screens'
      }
    }).then(client => {
      client.api.currentTest = {
        module: 'test_module',
        name: 'test_name',
        results: {
          failed: 1,
          passed: 0
        }
      };

      client.api.saveScreenshot = function (file, callback) {
        throw new Error('saveScreenshot should not be called');
      };

      client.api.end(function callback(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });
});
