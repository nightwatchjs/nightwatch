const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.perform()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.perform()', function (done) {
    let client = this.client.api;
    this.client.api.perform(function () {
      assert.deepStrictEqual(client.options, this.options);
    });

    this.client.start(done);
  });

  it('browser.perform() with async callback', async function () {
    const result = await this.client.api.perform(function() {
      return new Promise(resolve => {
        setTimeout(function() {
          resolve(100);
        }, 50);
      });
    });

    assert.strictEqual(result, 100);
  });

  it('browser.perform() with callback with "done" argument', function (done) {
    this.client.api.perform(function (complete) {
      assert.strictEqual(typeof complete, 'function');
      complete();
    });

    this.client.start(done);
  });

  it('browser.perform() with async callback with "browser" and "done" arguments', function (done) {
    let localClient = this.client.api;
    this.client.api.perform(function (client, complete) {
      delete client.isES6Async;
      assert.deepEqual(localClient, client);
      assert.strictEqual(typeof complete, 'function');
      complete();
    });

    this.client.start(done);
  });

  it('test actions() options in browser.perform()', function (done) {
    this.client.transport.driver.actions = function(opts) {
      assert.deepStrictEqual(opts, {async: true});

      return {
        keyDown() {
          return Promise.resolve();
        }
      };
    };

    this.client.api.perform(function() {
      const actions = this.actions({async: true});

      return actions.keyDown();
    });

    this.client.start(done);
  });
});
