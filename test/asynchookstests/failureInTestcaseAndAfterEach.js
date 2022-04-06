module.exports = {
  demoTest: function (client) {
    client.message1 = 'AfterEach Executed';
    client.message2 = 'Test Execution Performed';
    client.message3 = 'Test Execution Finished';

    client.waitForElementPresent({
      selector: 'element_that_does_not_exit',
      timeout: 1000,
      abortOnFailure: true
    });
    throw Error('test failed');
  },

  afterEach: function(client) {
    client.assert.strictEqual(client.message1, 'AfterEach Executed');
    client.perform(() => { 
      client.assert.strictEqual(client.message2, 'Test Execution Performed');
    });
    client.assert.strictEqual(client.message3, 'Test Execution Finished');
  }
};
