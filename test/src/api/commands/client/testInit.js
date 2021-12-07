const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.init()', function() {
  describe('with backwards compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true
      });
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.init();', function (done) {
      this.client.api.launchUrl = 'http://localhost';
      this.client.api.init(result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });


    it('browser.init() - with url', function (done) {
      this.client.api.init('http://localhost/test_url', result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });
  });

  describe('without compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done);
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.init();', function (done) {
      this.client.api.launchUrl = 'http://localhost';
      this.client.api.init(result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });


    it('browser.init() - with url', function (done) {
      this.client.api.init('http://localhost/test_url', result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });
  });
});
