module.exports = {
  tags: ['git'],
  'Demo test GitHub': function (client) {
    client
      .url('https://github.com/nightwatchjs/nightwatch')
      .waitForElementVisible('body')
      .assert.visible('#repository-container-header h1')
      .assert.containsText('#repository-container-header h1', 'nightwatch', 'Checking if project title is set to nightwatch');
  },

  after(client) {
    client.end();
  }
};
