module.exports = {
  before(client) {
    client.globals.calls++;
  },

  demoTest(client) {
    client
      .url('http://localhost')
      .setPassword('#weblogin', 'password')
      .end();
  },

  after(client, callback) {
    client.globals.calls++;
    callback();
  }
};
