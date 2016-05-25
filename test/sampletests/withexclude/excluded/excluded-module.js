module.exports = {
  demoTestExcluded : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
