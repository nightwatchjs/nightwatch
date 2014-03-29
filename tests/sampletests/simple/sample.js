module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
