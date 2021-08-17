const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.perform()', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
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
});
