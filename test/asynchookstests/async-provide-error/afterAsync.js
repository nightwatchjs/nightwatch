module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  after : function(client, done) {
    setTimeout(function() {
      done(new Error('Provided error afterAsync'));
    }, 10);
  }
};
