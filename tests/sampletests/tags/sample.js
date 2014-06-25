module.exports = {
  tags: ['login'],
  demoTagTest: function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
