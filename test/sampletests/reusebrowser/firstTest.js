module.exports = {
  '@desiredCapabilities': {
    name: 'first-test'
  },

  before(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  demoTestAsync(client) {
    client.url('http://localhost');
  },

  after(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      client.end();
      callback();
    }, 10);
  }
};