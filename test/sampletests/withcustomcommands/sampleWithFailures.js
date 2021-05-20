module.exports = {
  before(client) {
    client.globals.increment++;
  },

  demoTestAsync(client) {
    client.url('http://localhost').customCommandWithFailure().end();
  },

  after(client) {
    client.globals.increment++;
  }
};