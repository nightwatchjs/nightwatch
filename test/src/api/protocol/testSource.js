const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.source', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('client.source() get command', function() {
    return Globals.protocolTest({
      assertion: opts => {
        assert.strictEqual(opts.command, 'getPageSource');
      },
      commandName: 'source',
      args: []
    }).then((result) => {
      assert.strictEqual(result, '<html><body></body></html>');
    });
  });

  it('client.source() get command callback', function(done) {
    Globals.protocolTest({
      commandName: 'source',
      args: [
        function (result) {
          try {
            assert.strictEqual(result.status, 0);
            assert.ok(result.value.indexOf('<title>NightwatchJS</title>') > -1, 'Found <title> tag in response');
            assert.ok(true, 'GET source callback called');
            done();
          } catch (err) {
            done(err);
          }
        }
      ],
      mockDriverOverrides: {
        getPageSource() {
          return '<!DOCTYPE html><html><head><title>NightwatchJS</title></head><body><div id=\'some_id\'>some div content</div></body></html>';
        }
      }
    });
  });
});
