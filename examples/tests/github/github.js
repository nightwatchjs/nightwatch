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

  'part3 - should fail ' : function (client) {

    client
      .url('http://github.com/nightwatchjs/nightwatch')
      .expect.title().to.contain('uuuf').before(18000)
    // // .expect.title().to.be.present
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
