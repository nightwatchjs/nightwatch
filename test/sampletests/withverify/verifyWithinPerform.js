module.exports = {  
  demoTest(client) {
    client.url('http://localhost')
      .verify.equal(0, 1, 'custom message')
      .perform(function () {
        client
          .pause(1000)
          .verify.containsText('#weblogin', 'first');

      })
      .end();
  }
};
  