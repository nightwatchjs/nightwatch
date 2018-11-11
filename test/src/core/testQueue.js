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

  it('Test commands queue', function () {
    let client = this.client;
    let queue = client.queue;
    let urlCommand;
    let endCommand;
    Nocks.url().deleteSession();

    client.api.url('http://localhost').end();

    assert.equal(queue.tree.rootNode.childNodes.length, 2);
    urlCommand = queue.tree.rootNode.childNodes[0];
    endCommand = queue.tree.rootNode.childNodes[1];

    assert.equal(endCommand.done, false);
    assert.equal(urlCommand.done, false);
    assert.equal(endCommand.started, false);

    return this.client.start(err => {
      if (err) {
        throw err;
      }
      assert.equal(urlCommand.started, true);
      assert.equal(urlCommand.done, true);
      assert.equal(endCommand.childNodes.length, 1);
      assert.equal(endCommand.done, true);
      assert.equal(queue.tree.rootNode.childNodes.length, 0);
    });
  });
});
