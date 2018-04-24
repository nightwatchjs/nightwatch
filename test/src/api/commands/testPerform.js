const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('perform', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

    it('client.perform()', function(done) {
      this.client.api.perform(function() {
        assert.deepEqual(this.client.api, this);
      });

      this.client.start(done);
    }),

    it('client.perform() with async callback', function(done) {
        this.client.api.perform(function(complete) {
        assert.equal(typeof complete, 'function');
        complete();
      });

      this.client.start(done);
    }),

    it('client.perform() with async callback and api param', function(done) {
      let local_client = this.client.api;
      this.client.api.perform(function(client, complete) {
        assert.deepEqual(local_client, client);
        assert.equal(typeof complete, 'function');
        complete();
      });

      this.client.start(done);
    });
});