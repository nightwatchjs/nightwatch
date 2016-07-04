module.exports = {
  tags: ['skip'],
  demoSkipTagTest: function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};