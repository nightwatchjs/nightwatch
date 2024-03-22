module.exports = {
  '@desiredCapabilities': {
    name: 'test-Async'
  },

  before(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  demoTestAsync(client) {
    client.url('http://localhost').end();
  },

  after(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  }
};