const assert = require('assert');
const Globals = require('../../../../lib/globals.js');

describe('document.injectScript()', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('document.injectScript() with scriptUrl only', function(done) {
    let executeScriptCalled;
    const args = ['https://some-host.com/some/path'];

    Globals.protocolTest({
      commandName: 'document.injectScript',
      args: [...args, function (result) {
        try {
          assert.strictEqual(result.status, 0);
          assert.deepStrictEqual(result.value, args);
          assert.strictEqual(executeScriptCalled, true);
          done();
        } catch (err) {
          done(err);
        }
      }],
      mockDriverOverrides: {
        executeScript(script, ...args) {
          executeScriptCalled = true;

          return args;
        }
      }
    });
  });

  it('document.injectScript() with both arguments', function(done) {
    let executeScriptCalled;
    const args = ['https://some-host.com/some/path', 'some-id'];

    Globals.protocolTest({
      commandName: 'document.injectScript',
      args: [...args, function (result) {
        try {
          assert.strictEqual(result.status, 0);
          assert.deepStrictEqual(result.value, args);
          assert.strictEqual(executeScriptCalled, true);
          done();
        } catch (err) {
          done(err);
        }
      }],
      mockDriverOverrides: {
        executeScript(script, ...args) {
          executeScriptCalled = true;

          return args;
        }
      }
    });
  });
});
