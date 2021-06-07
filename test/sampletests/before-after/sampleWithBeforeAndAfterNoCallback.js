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
    client.end().perform(function() {
      client.globals.calls++;
    });
  }
};