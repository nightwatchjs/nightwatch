const assert = require('assert');
const nock = require('nock');
const Nocks = require('../../../../lib/nocks.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('document.injectScript()', function() {
  before(function(done) {
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

  it('document.injectScript() with scriptUrl only', async function () {
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/sync')
      .reply(200, function (uri, requestBody) {
        assert.strictEqual(typeof requestBody.script, 'string');
        assert.deepStrictEqual(requestBody.args, [
          'https://some-host.com/some/path'
        ]);

        return {
          value: {
            'element-6066-11e4-a52e-4f735466cecf': '999'
          }
        };
      });
    
    let callbackResult;
    await this.client.api.document.injectScript('https://some-host.com/some/path', function (result) {
      callbackResult = result;
    });
    await this.client.start();

    assert.strictEqual(await callbackResult.value.getId(), '999');
  });

  it('document.injectScript() with both arguments', async function () {
    nock('http://localhost:10195')
      .post('/session/13521-10219-202/execute/sync')
      .reply(200, function (uri, requestBody) {
        assert.strictEqual(typeof requestBody.script, 'string');
        assert.deepStrictEqual(requestBody.args, [
          'https://some-host.com/some/path',
          'some-id'
        ]);

        return {
          value: {
            'element-6066-11e4-a52e-4f735466cecf': '998'
          }
        };
      });
    
    let callbackResult;
    await this.client.api.document.injectScript('https://some-host.com/some/path', 'some-id', function (result) {
      callbackResult = result;
    });
    await this.client.start();

    assert.strictEqual(await callbackResult.value.getId(), '998');
  });
});
