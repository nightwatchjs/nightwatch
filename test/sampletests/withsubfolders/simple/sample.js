module.exports = {
  simpleDemoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
