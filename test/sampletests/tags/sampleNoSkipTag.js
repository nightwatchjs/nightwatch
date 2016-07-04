module.exports = {
  tags: ['login'],
  demoNoSkipTagTest: function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};