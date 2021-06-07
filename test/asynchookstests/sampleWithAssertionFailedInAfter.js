module.exports = {
  before(client) {
    client.url('http://localhost').perform(function() {
      client.globals.calls++;
    });
  },

  demoTestAsyncOne: function (client) {
    client.url('http://localhost');
  },

  after(client) {
    client.assert.equal(0, 1);
    client.end();
  }
};
