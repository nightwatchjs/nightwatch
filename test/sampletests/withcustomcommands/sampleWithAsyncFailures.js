module.exports = {
  before(client) {
    client.globals.increment++;
  },

  async demoTestAsync(client) {
    await client.url('http://localhost').customCommandWithFailureClass();
    // below statement should be unreachable because the custom command should be rejected
    client.globals.increment++;
  },

  after(client) {
    client.globals.increment++;
  }
};