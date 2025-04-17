const assert = require('assert');

describe('basic describe test', async function () {
  const nwClient = this['[client]'];

  const asynctreeEventListener = () => {
    this.globals.asynctreeFinishedEventCount++;
  };

  const queueEventListener = () => {
    this.globals.queueFinishedEventCount++;
  };

  this.desiredCapabilities = {
    name: 'basicDescribe'
  };

  test('with awaited JS command bw Nightwatch commands', async function (client) {
    nwClient.queue.tree.on('asynctree:finished', asynctreeEventListener);

    // queue event listeners are automatically removed after
    // every (test case + afterEach + after (if applicable))
    // so, no need to remove this listener manually before next test case run.
    nwClient.queue.on('queue:finished', queueEventListener);

    await client.assert.strictEqual(client.options.desiredCapabilities.name, 'basicDescribe');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 1);

    await client.url('http://localhost');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 2);

    await new Promise((resolve) => {
      setTimeout(function() {
        resolve(null);
      }, 50);
    });
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 2);

    await client.assert.elementPresent('#weblogin');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 3);

    // queue:finished event shouldn't be emitted in between the test.
    assert.equal(this.globals.queueFinishedEventCount, 0);
  });

  test('with await in last command', async function (client) {
    nwClient.queue.tree.on('asynctree:finished', asynctreeEventListener);

    await client.assert.strictEqual(client.options.desiredCapabilities.name, 'basicDescribe');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 1);

    await client.url('http://localhost');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 2);

    await client.assert.elementPresent('#weblogin');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 3);
  });

  test('without await in last command', async function (client) {
    nwClient.queue.tree.on('asynctree:finished', asynctreeEventListener);

    await client.assert.strictEqual(client.options.desiredCapabilities.name, 'basicDescribe');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 1);

    await client.url('http://localhost');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 2);

    client.assert.elementPresent('#weblogin');
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 3);
  });

  afterEach(function () {
    nwClient.queue.tree.removeListener('asynctree:finished', asynctreeEventListener);
    assert.equal(nwClient.queue.tree.rootNode.childNodes.length, 0);
  });

  after(function (client) {
    client.end();
  });
});
