module.exports = {
  beforeChildProcess: async function(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  demoTestAsyncOne: function (client) {
    client.url('http://localhost');
  },

  demoTestAsyncTwo: function (client) {
    client.end();
  },

  afterChildProcess: function(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  }
};
