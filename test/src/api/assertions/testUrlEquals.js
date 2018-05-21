const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.urlEquals', function () {
  it('urlEquals assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'urlEquals',
      args: ['http://www.nightwatchjs.org'],
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
        assert.ok(message.startsWith('Testing if the URL equals "http://www.nightwatchjs.org"'));
      }
    }, done);
  });

  it('urlEquals assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'urlEquals',
      args: ['http://www.google.com'],
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
