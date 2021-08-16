const assert = require('assert');

const Globals = require('../../../lib/globals.js');

describe('alert commands', function () {

  before(function () {
    Globals.protocolBefore();
  });

  it('testAcceptAlert', function (done) {
    Globals.protocolTest({
      commandName: 'acceptAlert',
      assertion() {
        done();
      }
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    });
  });

  it('testDismissAlert', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
        done();
      },
      commandName: 'dismissAlert'
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    });;
  });

  it('testGetAlertText', function (done) {
    Globals.protocolTest({
      assertion: function (text) {
        try {
          assert.strictEqual(text, 'alert text');
          done();
        } catch (err) {
          done(err);
        }
      },
      commandName: 'getAlertText'
    });
  });

  it('testSetAlertText', function (done) {
    let text = 'prompt text to set';

    Globals.protocolTest({
      assertion: function (value) {
        try {
          assert.strictEqual(value, text);
          done();
        } catch (err) {
          done(err);
        }
      },
      commandName: 'setAlertText',
      args: [text]
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    });;
  });

});
