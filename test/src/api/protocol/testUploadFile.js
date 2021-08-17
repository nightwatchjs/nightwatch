const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const mockery = require('mockery');
mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

describe('uploadFile command', function () {
  before(function () {
    Globals.protocolBefore();
  });

  after(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  })

  it('should clear value and setValue', function () {
    let fakeRemoteCalled = false;
    class FakeRemote {}
    FakeRemote.FileDetector = class {
      constructor() {
        fakeRemoteCalled = true;
      }  
    }
    mockery.registerMock('selenium-webdriver/remote', FakeRemote);
    return Globals.protocolTest({
      commandName: 'uploadFile',
      args: [
        'css selector', '#weblogin', '/file.js',
        function (result) {
          assert.deepStrictEqual(result.value, null);
          assert.deepStrictEqual(result.status, 0);
        }
      ],
      assertion: function (opts) {
        assert.ok(['findElements', 'setFileDetector', 'sendKeysToElement'].includes(opts.command));
        if(opts == 'setFileDetector' || opts.command == 'sendKeysToElement'){
            assert.strictEqual(fakeRemoteCalled, true);
        }
      }
    });
  });
});
