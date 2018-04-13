const assert = require('assert');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('perform', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.perform()', function (done) {
    let client = this.client.api;
    this.client.api.perform(function () {
      assert.deepEqual(client, this);
    });

    this.client.start(done);
  });

  it('client.perform() with async callback', function (done) {
    this.client.api.perform(function (complete) {
      assert.equal(typeof complete, 'function');
      complete();
    });

    this.client.start(done);
  });

  it('client.perform() with async callback and api param', function (done) {
    let localClient = this.client.api;
    this.client.api.perform(function (client, complete) {
      assert.deepEqual(localClient, client);
      assert.equal(typeof complete, 'function');
      complete();
    });

    this.client.start(done);
  });
});