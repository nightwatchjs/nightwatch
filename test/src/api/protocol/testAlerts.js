const assert = require('assert');

const Globals = require('../../../lib/globals.js');

describe('alert commands', function () {

  before(function () {
    Globals.protocolBefore({
      backwards_compatibility_mode: true
    });
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

  it('test alerts.accept()', function (done) {
    Globals.protocolTest({
      commandName: 'alerts.accept'
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    }).catch(err => {
      return err;
    }).then(err => {
      done(err);
    });
  });

  it('test alerts.dismiss()', function (done) {
    Globals.protocolTest({
      commandName: 'alerts.dismiss'
    }).then((result) => {
      assert.strictEqual(result.value, null);
      assert.strictEqual(result.status, 0);
    }).catch(err => {
      return err;
    }).then(err => {
      done(err);
    });
  });

  it('test alerts.getText()', function (done) {
    Globals.protocolTest({
      assertion: function (text) {
        try {
          assert.strictEqual(text, 'alert text');
          done();
        } catch (err) {
          done(err);
        }
      },
      commandName: 'alerts.getText'
    });
  });

  it('test alerts.setText()', function (done) {
    const text = 'prompt text to set';

    Globals.protocolTest({
      assertion: function (value) {
        assert.strictEqual(value, text);
      },
      commandName: 'alerts.setText',
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

  it('test alerts.setText() with error', function (done) {
    const text = 2;

    Globals.protocolTest({
      assertion: function (value) {
        assert.strictEqual(value, text);
      },
      commandName: 'alerts.setText',
      args: [text]
    }).catch(err => {
      assert.strictEqual(
        err.message,
        'Error while running "alerts.setText" command: First argument passed to .alerts.setText() must be a string.'
      );
    }).catch(err => {
      return err;
    }).then(err => {
      done(err);
    });
  });
});
