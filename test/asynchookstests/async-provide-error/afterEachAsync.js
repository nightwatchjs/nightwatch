module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  afterEach : function(client, done) {
    setTimeout(function() {
      done(new Error('Provided error afterEachAsync'));
    }, 10);
  }
};
