const assert = require('assert');
const Globals = require('../../lib/globals/expect.js');
const Nocks = require('../../lib/nocks.js');

describe('test Queue', function () {
  beforeEach(function (done) {
    Globals.beforeEach.call(this, {
      silent: true,
          output: false
    }, () => {
      this.client.queue.reset();
      done();
    });
  });

    afterEach(function (done) {
        Globals.afterEach.call(this, done);
    });

    it('Test commands queue', function (done) {
      let client = this.client;
      let queue = client.queue;
      let urlCommand;
      let endCommand;
      Nocks.url().deleteSession();

      client.api.url('http://localhost').end();

      assert.equal(queue.list().length, 2);
      urlCommand = queue.rootNode.childNodes[0];
      endCommand = queue.rootNode.childNodes[1];

      assert.equal(endCommand.done, false);
      assert.equal(urlCommand.done, false);
      assert.equal(endCommand.started, false);

      this.client.start(err => {
        if (err) {
          return done(err);
        }

        assert.equal(urlCommand.done, true);
        assert.equal(endCommand.childNodes.length, 1);
        assert.equal(endCommand.done, true);
        assert.equal(queue.list().length, 2);
        done();
      });

      assert.equal(urlCommand.started, true);
  });

  it('waitForElement failures should report a failure when abortOnFailure is true', function (done) {

    let client = this.client;
    let queue = this.client.queue;

    client.api
      .url('http://localhost')
      .waitForElementVisible('#badElement', 15)
      .end();

    // this will timeout on a failure
    queue.run(err => {
      if (err) {
        done();
      }
    });
  });

  it('Failed assertions should throw an error', function (done) {
    let api = this.client.api;
    let client = this.client;
    let queue = this.client.queue;

    client.api.assert.visible('#badElement');

    queue.run(err => {
      if (err) {
        try {
          assert.equal(err.message,
            `Testing if element <#badElement> is visible. Element could not be located in 1000 ms. - expected \u001b[0;32m"true"\u001b[0m but got: \u001b[0;31m"null"\u001b[0m`
          );
          done();
        } catch (err) {
          done(err);
        }
        return;
      }
      done(
        Error('should have thrown an error for command failure with abortOnFailure true')
      );
    });
  });
});
