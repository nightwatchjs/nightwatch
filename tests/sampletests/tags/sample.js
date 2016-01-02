module.exports = {
  tags: ['login', 'other'],
  demoTagTest: function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
