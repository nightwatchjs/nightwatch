module.exports = {
  'Demo test GitHub' : function (client) {
    client
      .url("https://github.com/beatfactor/nightwatch")
      .waitForElementVisible('body', 1000)
      .assert.title('beatfactor/nightwatch · GitHub')
      .assert.visible('.container .breadcrumb a span')
      .assert.containsText('.container .breadcrumb a span', 'nightwatch', 'Checking project title is set tot nightwatch')
      .end();
  }
}