describe('Github', function() {

  it('Demo test GitHub', function (client) {
    client
      .url('https://github.com/nightwatchjs/nightwatch')
      .waitForElementVisible('body', 1000)
      .assert.title('nightwatchjs/nightwatch · GitHub')
      .assert.visible('.container .breadcrumb a span')
      .assert.containsText('.container .breadcrumb a span', 'nightwatch', 'Checking project title is set to nightwatch');
  });

  after(function(client, done) {
    client.end(function() {
      done();
    });
  });

});


