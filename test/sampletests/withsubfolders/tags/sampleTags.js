module.exports = {
  tags: ['login', 'logout'],
  otherDemoTagTest: function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
