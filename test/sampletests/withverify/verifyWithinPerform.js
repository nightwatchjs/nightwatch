module.exports = {
  before(client) {
    client.globals.calls++;
  },
  
  demoTest(client) {
    client.url('http://localhost')
      .verify.equal(0, 1, 'custom message')
      .perform(function () {
        client
          .pause(1000)
          .verify.containsText('#weblogin', 'first');

      })
      .end();
  },
  
  after(client, callback) {
    client.globals.calls++;
    callback();
  }
};
  