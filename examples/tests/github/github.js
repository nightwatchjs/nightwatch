module.exports = {
  tags: ['git'],
  'Demo test GitHub' : function (client) {
    return new Promise((resolve) => {
      client
        .url('http://github.com/nightwatchjs/nightwatch')
        .waitForElementVisible('body', 1000)
        .assert.visible('.container h1 strong a')
        .assert.containsText('.container h1 strong a', 'nightwatch', 'Checking project title is set to nightwatch')
        .perform(function() {
          resolve();
        });
    });
  },

  after(client) {
    client.end();
  }
};
