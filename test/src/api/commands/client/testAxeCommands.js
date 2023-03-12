const assert = require('assert');
const nock = require('nock');
const Nocks = require('../../../../lib/nocks.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('accessibility commands', function () {
  before(function (done) {
    Nocks.cleanAll();
    try {
      Nocks.enable();
    } catch (e) {
      // ignore
    }
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    Nocks.disable();
    CommandGlobals.afterEach.call(this, done);
  });

  it('test axe commands loaded onto the main api', function () {
    assert.strictEqual(typeof this.client.api.axeInject, 'function');
    assert.strictEqual(typeof this.client.api.axeRun, 'function');
  });

  it('test .a11y.runTests()', async function () {
    // nock for axeInject
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/sync')
      .reply(200, function () {
        return {
          value: null
        };
      });

    // nock for axeRun
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/async')
      .reply(200, function (uri, requestBody) {
        assert.deepStrictEqual(requestBody.args, [
          'body',
          {runOnly: ['color-contrast', 'image-alt']}
        ]);

        return {
          value: {}
        };
      });
    
    let axeResult;
    await this.client.api.a11y.runTests('body', {runOnly: ['color-contrast', 'image-alt']}, function (result) {
      axeResult = result;
    });
    await this.client.start();

    assert.deepStrictEqual(axeResult, {});
  });

  it('test .a11y.runTests() without options', async function () {
    // nock for axeInject
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/sync')
      .reply(200, function () {
        return {
          value: null
        };
      });

    // nock for axeRun
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/async')
      .reply(200, function (uri, requestBody) {
        assert.deepStrictEqual(requestBody.args, [
          'body',
          {}
        ]);

        return {
          value: {}
        };
      });
    
    let axeResult;
    await this.client.api.a11y.runTests('body', function (result) {
      axeResult = result;
    });
    await this.client.start();

    assert.deepStrictEqual(axeResult, {});
  });

  it('test .a11y.runTests() without any argument', async function () {
    // nock for axeInject
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/sync')
      .reply(200, function () {
        return {
          value: null
        };
      });

    // nock for axeRun
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/async')
      .reply(200, function (uri, requestBody) {
        assert.deepStrictEqual(requestBody.args, [
          'html',
          {}
        ]);

        return {
          value: {}
        };
      });
    
    let axeResult;
    await this.client.api.a11y.runTests(function (result) {
      axeResult = result;
    });
    await this.client.start();

    assert.deepStrictEqual(axeResult, {});
  });
});
