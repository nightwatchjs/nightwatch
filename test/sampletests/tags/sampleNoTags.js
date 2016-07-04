module.exports = {
  tags: [],
  demoNoTagTest: function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};