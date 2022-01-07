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

    assert.strictEqual(queue.tree.rootNode.childNodes.length, 2);
    urlCommand = queue.tree.rootNode.childNodes[0];
    endCommand = queue.tree.rootNode.childNodes[1];

    assert.strictEqual(endCommand.done, false);
    assert.strictEqual(urlCommand.done, false);
    assert.strictEqual(endCommand.started, false);

    return this.client.start(err => {
      if (err) {
        throw err;
      }
      assert.strictEqual(urlCommand.started, true);
      assert.strictEqual(urlCommand.done, true);
      assert.strictEqual(endCommand.childNodes.length, 1);
      assert.strictEqual(endCommand.done, true);
      assert.strictEqual(queue.tree.rootNode.childNodes.length, 0);
    });
  });
});
