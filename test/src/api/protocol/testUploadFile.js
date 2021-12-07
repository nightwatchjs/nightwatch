const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const mockery = require('mockery');

describe('uploadFile command', function () {
  before(function () {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    Globals.protocolBefore();
  });

  after(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('should call FileDetector Api from selenium', function () {
    let fakeRemoteCalled = false;
    class FakeRemote {}
    FakeRemote.FileDetector = class {
      constructor() {
        fakeRemoteCalled = true;
      }
    };

    mockery.registerMock('selenium-webdriver/remote', FakeRemote);
    const commands = [];

    return Globals.protocolTest({
      commandName: 'uploadFile',
      args: [
        'css selector', '#weblogin', '/file.js',
        function (result) {
          assert.deepStrictEqual(result.value, null);
          assert.deepStrictEqual(result.status, 0);
        }
      ],

      assertion(opts) {
        commands.push(opts.command);
      }
    }).then(() => {
      assert.deepStrictEqual(commands, ['findElements', 'setFileDetector', 'sendKeysToElement']);
      assert.strictEqual(fakeRemoteCalled, true);
    });
  });
});
