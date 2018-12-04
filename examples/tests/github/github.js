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

  'active - success': function(client) {

    client
      .url('http://github.com/nightwatchjs/nightwatch');

    client.expect.url().to.contain('whatever');

    client.expect.url().to.contain('nightwatchjs/nightwatch');
    client.expect.url().to.not.contain('whatever');


    client.expect.title().to.contain('GitHub - nightwatchjs/nightwatch');

    client.expect.element('.new-pull-request-btn').yPosition.to.equal(555);
    client.expect.element('.new-pull-request-btn').yPosition.to.not.equal(88888);

    client.expect.element('.new-pull-request-btn').xPosition.to.equal(238);
    client.expect.element('.new-pull-request-btn').xPosition.to.not.equal(88888);

    client.expect.element('#user-content-homepage--getting-started--developer-guide--api-reference--blog').to.have.locationInView;

    client.expect.element('.new-pull-request-btn').value.to.equal('');

    client.expect.element('.new-pull-request-btn').width.to.equal(122);

    client.expect.element('.new-pull-request-btn').width.to.not.equal(33333);

    client.expect.element('.new-pull-request-btn').height.to.equal(28);

    client.expect.element('.new-pull-request-btn').height.to.not.equal(333333);

    client.expect.element('body').to.be.active;

  },

  'not active - fail ': function(client) {

    client.expect.element('.new-pull-request-btn').to.not.be.active;

  },

  after(client) {
    client.end();
  }
};
