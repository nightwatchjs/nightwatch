module.exports = {
  demoTest: function (client) {
    client.url('http://localhost')
      .waitForElementVisible('#finlandia', 1000)
      .waitForElementVisible('#finlandia')
      .assert.containsText('#finlandia', 'sibelius');
  },

  after(client) {
    client.end();
  }
};
