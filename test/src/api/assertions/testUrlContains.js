const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.urlContains', function () {
  it('urlContains assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'urlContains',
      args: ['nightwatchjs'],
      api: {
        url(callback) {
          callback({
            value: 'http://www.nightwatchjs.org'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'http://www.nightwatchjs.org');
        assert.ok(message.startsWith('Testing if the URL contains "nightwatchjs"'));
      }
    }, done);
  });

  it('urlContains assertion failed without value field in response', function (done) {
    Globals.assertionTest({
      assertionName: 'urlContains',
      args: ['nightwatchjs'],
      api: {
        url(callback) {
          callback({
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.strictEqual(value, '');
      }
    }, done);
  });

  it('urlContains assertion failed with empty response', function (done) {
    Globals.assertionTest({
      assertionName: 'urlContains',
      args: ['nightwatchjs'],
      api: {
        url(callback) {
          callback();
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.strictEqual(value, '');
      }
    }, done);
  });

  it('urlContains assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'urlContains',
      args: ['google'],
      api: {
        url(callback) {
          callback({
            value: 'http://www.nightwatchjs.org'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'http://www.nightwatchjs.org');
      }
    }, done);
  });
});