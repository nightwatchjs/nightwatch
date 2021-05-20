module.exports = {
  before(client) {
    client.globals.increment++;
  },

  'sample test with custom element command' (client) {
    client.url('http://localhost').customElementPresent('#weblogin').end();
  },

  after(client) {
    client.globals.increment++;
  }
};
