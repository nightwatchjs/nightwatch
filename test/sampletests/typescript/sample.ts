module.exports = {
  demoTest: function(client: any) {
    client.url('http://localhost')
      .typescript.tsWait(10)
      .assert.elementPresent('#weblogin');
  },

  after: function(client: any) {
    client.end();
  }
};
