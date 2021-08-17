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
      }
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    }).catch(err => {
      return err;
    }).then(err => {
      done(err);
    });
  });

  it('testDismissAlert', function (done) {
    Globals.protocolTest({
      assertion: function (opts) {
      },
      commandName: 'dismissAlert'
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    }).catch(err => {
      return err;
    }).then(err => {
      done(err);
    });
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
        assert.strictEqual(value, text);
      },
      commandName: 'setAlertText',
      args: [text]
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    }).catch(err => {
      return err;
    }).then(err => {
      done(err);
    });
  });

});
