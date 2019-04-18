module.exports = {
  tags: ['git'],
  'Demo test GitHub' : function (client) {
    client
      .url('http://github.com/nightwatchjs/nightwatch')
      .waitForElementVisible('xbody', 1000)
      .waitForElementVisible('.container h1 strong a')
      .assert.containsText('.container h1 strong a', 'nightwatch', 'Checking project title is set to nightwatch')
      .expect.element('.branch-select-menu button').to.be.active;
  },

  after(client) {
    client.end();
  }
};
