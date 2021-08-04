const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const sinon = require('sinon');
const remote = require('selenium-webdriver/remote');
var myStub;

describe('uploadFile command', function () {
  before(function () {
    Globals.protocolBefore();
    myStub = sinon.stub().callsFake();
    Object.setPrototypeOf(remote.FileDetector.prototype.constructor, myStub);
  });

  after(function() {
    sinon.restore();
  })

  it('should clear value and setValue', function () {

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
            assert(myStub.calledOnce);
        }
      }
    });
  });
});
