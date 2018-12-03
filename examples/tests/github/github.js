module.exports = {
  tags: ['git'],
  // 'Demo test GitHub' : function (client) {
  //   client
  //     .url('http://github.com/nightwatchjs/nightwatch')
  //     .expect.title().to.contain('GitHub - nightwatchjs/nightwatch')
  //     // // .expect.title().to.be.present
  //     // .waitForElementVisible('body', 1000)
  //     // .pause()
  //     // // .expect.title().contains('something...')
  //     // .waitForElementVisible('.container h1 strong a')
  //     // .assert.containsText('.container h1 strong a', 'nightwatch', 'Checking project title is set to nightwatch')
  // },

  // 'part2 ' : function (client) {
  //   client
  //     .expect.title().to.not.contain('uuuf')
  //   // // .expect.title().to.be.present
  //   // .waitForElementVisible('body', 1000)
  //   // .pause()
  //   // // .expect.title().contains('something...')
  //   // .waitForElementVisible('.container h1 strong a')
  //   // .assert.containsText('.container h1 strong a', 'nightwatch', 'Checking project title is set to nightwatch')
  // },

  'active - success' : function (client) {

    client
      .url('http://github.com/nightwatchjs/nightwatch')
      .expect.title().to.contain('GitHub - nightwatchjs/nightwatch');

    client
      .expect.element('body').to.be.active;
    // // .expect.title().to.be.present
    // .waitForElementVisible('body', 1000)
    // .pause()
    // // .expect.title().contains('something...')
    // .waitForElementVisible('.container h1 strong a')
    // .assert.containsText('.container h1 strong a', 'nightwatch', 'Checking project title is set to nightwatch')
  },

  'not active - fail ' : function (client) {

    client
      .expect.element('.new-pull-request-btn').to.not.be.active

    // .waitForElementVisible('body', 1000)
    // .pause()
    // // .expect.title().contains('something...')
    // .waitForElementVisible('.container h1 strong a')
    // .assert.containsText('.container h1 strong a', 'nightwatch', 'Checking project title is set to nightwatch')
  },

  after(client) {
    client.end();
  }
};
