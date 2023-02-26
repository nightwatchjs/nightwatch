const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const nock = require('nock');

describe('accessibility commands', function () {
  before(function (done) {
    try {
      nock.activate();
    } catch (e){
      //ignore
    }
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    nock.cleanAll();
    nock.restore();
    CommandGlobals.afterEach.call(this, done);
  });

  it('test axe commands loaded onto the main api', function () {
    assert.strictEqual(typeof this.client.api.axeInject, 'function');
    assert.strictEqual(typeof this.client.api.axeRun, 'function');
  });

  it('test .a11y.runTests()', function (done) {
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
    
    this.client.api.a11y.runTests('body', {runOnly: ['color-contrast', 'image-alt']}, function (result) {
      assert.deepStrictEqual(result, {});
    });

    this.client.start(done);
  });

  it('test .a11y.runTests() without options', function (done) {
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
    
    this.client.api.a11y.runTests('body', function (result) {
      assert.deepStrictEqual(result, {});
    });

    this.client.start(done);
  });

  it('test .a11y.runTests() without any argument', function (done) {
    this.client.api.a11y.runTests();

    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('First argument passed to .a11y.runTests() must be a selector string.'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
