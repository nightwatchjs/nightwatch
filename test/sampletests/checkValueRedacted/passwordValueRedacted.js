module.exports = {
  before(client) {
    client.globals.calls++;
  },

  demoTest(client) {
    client
      .url('http://localhost')
      .setPassword('#weblogin', 'redacted_text')
      .setValue('#weblogin', 'non_redacted')
      .end();
  },

  after(client, callback) {
    client.globals.calls++;
    callback();
  }
};
