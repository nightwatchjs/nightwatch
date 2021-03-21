module.exports = {
  demoTest: function(client: any) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  },

  after: function(client: any) {
    client.end();
  }
};
