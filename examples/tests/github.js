module.exports = {
  tags: ['git'],
  'Demo test GitHub' : function (client) {
    client
      .url('https://github.com/nightwatchjs/nightwatch')
      .waitForElementVisible('body', 1000)
      .assert.title('nightwatchjs/nightwatch · GitHub')
      .assert.visible('div.repohead-details-container span.author > a > span')
      .assert.containsText('div.repohead-details-container span.author > a > span', 'nightwatchjs', 'Checking repo title is set to nightwatchjs');
  },

  after : function(client) {
    client.end();
  }
};
