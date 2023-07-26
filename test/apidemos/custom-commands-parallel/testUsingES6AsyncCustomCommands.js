describe('Test Using Sync Custom Command returning NightwatchAPI', function() {
  before(browser => {
    browser.url('http://localhost');
  });

  it('sampleTest', browser => {
    browser
      .otherCommand()
      .end();
  });
});
