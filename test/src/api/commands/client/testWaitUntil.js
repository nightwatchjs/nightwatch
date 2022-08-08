const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.waitUntil()', function () {
  describe('with backwards compat mode', function() {
    beforeEach(function (done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true,
        globals: {
          waitForConditionPollInterval: 50,
          waitForConditionTimeout: 500
        }
      });
    });

    afterEach(function (done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('client.waitUntil() success with defaults', function (done) {
      this.client.api.waitUntil(function () {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve(true);
          }, 100);
        });
      }, function(result) {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });
  });


  describe('without compat mode', function() {
    beforeEach(function (done) {
      CommandGlobals.beforeEach.call(this, done, {
        globals: {
          waitForConditionPollInterval: 50,
          waitForConditionTimeout: 500
        }
      });
    });

    afterEach(function (done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('client.waitUntil() success with defaults', function (done) {
      this.client.api.waitUntil(function () {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve(true);
          }, 100);
        });
      }, function(result) {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });

    it('client.waitUntil() function success with defaults', function (done) {
      let tries = 0;
      const client = this.client.api;

      this.client.api.waitUntil(function () {
        assert.deepStrictEqual(this.options, client.options);
        if (tries > 5) {
          return true;
        }

        tries++;

        return false;
      }, function(result) {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });

    it('client.waitUntil() function failure with defaults', function (done) {
      const client = this.client.api;

      this.client.api.waitUntil(function () {
        assert.deepStrictEqual(this.options, client.options);

        return false;
      }, function(result) {
        assert.strictEqual(result.status, -1);
      });

      this.client.start(function(err) {
        try {
          assert.ok(err instanceof Error);
          assert.ok(err.message.includes('Error while running "waitUntil" command: [TimeoutError] Wait timed out after'), 'Should include: ' + err.message);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.waitUntil() function failure with custom timeout', function (done) {
      let tries = 0;
      let startTime = new Date().valueOf();
      let timeDiff;
      const maxTimeout = 100;
      const client = this.client.api;
      let result;

      this.client.api.waitUntil(function () {
        assert.deepStrictEqual(this.options, client.options);
        tries++;

        return false;
      }, maxTimeout, 50, function(response) {
        timeDiff = new Date().valueOf() - startTime;
        result = response;
      });

      this.client.start(err => {
        try {
          assert.ok(timeDiff <= maxTimeout+100, `Expected lower than ${maxTimeout}, but got ${timeDiff}`);
          assert.strictEqual(result.status, -1);
          assert.strictEqual(tries, 3);
          assert.ok(err instanceof Error);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.waitUntil() function failure with custom timeout, interval, message, and callback', function (done) {
      let tries = 0;
      let startTime = new Date().valueOf();
      let timeDiff;
      const maxTimeout = 100;
      const client = this.client.api;
      let result;

      this.client.api.waitUntil(function () {
        assert.deepStrictEqual(this.options, client.options);
        tries++;

        return false;
      }, maxTimeout, 50, 'custom error message', function(response) {
        timeDiff = new Date().valueOf() - startTime;
        result = response;
      });

      this.client.start(err => {
        try {
          assert.ok(timeDiff <= maxTimeout+100, `Expected lower than ${maxTimeout}, but got ${timeDiff}`);
          assert.strictEqual(result.status, -1);
          assert.ok(err instanceof Error);
          const messageParts = err.message.split('\n');
          assert.strictEqual(messageParts[0], 'Error while running "waitUntil" command: [TimeoutError] custom error message');
          assert.ok(messageParts[1].startsWith('Wait timed out after'));

          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.waitUntil() function failure with custom timeout, interval, message', function (done) {
      let tries = 0;
      const maxTimeout = 100;
      const client = this.client.api;

      this.client.api.waitUntil(function () {
        assert.deepStrictEqual(this.options, client.options);
        tries++;

        return false;
      }, maxTimeout, 50, 'custom error message');

      this.client.start(err => {
        try {
          assert.ok(err instanceof Error);
          const messageParts = err.message.split('\n');
          assert.strictEqual(messageParts[0], 'Error while running "waitUntil" command: [TimeoutError] custom error message');
          assert.ok(messageParts[1].startsWith('Wait timed out after'));

          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.waitUntil() function failure with custom timeout and default interval', function (done) {
      let tries = 0;
      let startTime = new Date().valueOf();
      let timeDiff;
      const maxTimeout = 100;
      const client = this.client.api;
      let result;

      this.client.api.waitUntil(function () {
        assert.deepStrictEqual(this.options, client.options);
        tries++;

        return false;
      }, maxTimeout, function(response) {
        timeDiff = new Date().valueOf() - startTime;
        result = response;
      });

      this.client.start(err => {
        try {
          assert.ok(err instanceof Error);
          assert.ok(timeDiff <= maxTimeout+100, `Expected lower than ${maxTimeout}, but got ${timeDiff}`);
          assert.strictEqual(result.status, -1);
          assert.strictEqual(tries, 3);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.waitUntil() function with nightwatch perform() command', function (done) {
      this.client.api.waitUntil(async function () {
        const result = await this.perform(function() {
          return 1;
        });

        return result === 1;
      }, 100, function(result) {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });

    it('client.waitUntil() function with nightwatch perform() command and Promise', function (done) {
      this.client.api.waitUntil(async function () {
        const result = await this.perform(async function() {
          return 10;
        });

        return result === 10;
      }, 100, function(result) {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });
  });
});
