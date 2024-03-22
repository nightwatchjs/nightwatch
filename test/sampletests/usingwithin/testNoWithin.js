module.exports = {
  demoTest: function (client) {
    client
      .url('http://localhost')
      .waitForElementVisible('#finlandia', 1000)
  },

  after(client) {
    client.end();
  }
};
