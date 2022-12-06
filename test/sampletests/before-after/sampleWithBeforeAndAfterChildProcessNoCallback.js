module.exports = {
  beforeChildProcess(client) {
    client.url('http://localhost').perform(function() {
      client.globals.calls++;
    });
  },

  demoTestAsyncOne: function (client) {
    client.url('http://localhost');
  },

  afterChildProcess(client) {
    client.end().perform(function() {
      client.globals.calls++;
    });
  }
};
