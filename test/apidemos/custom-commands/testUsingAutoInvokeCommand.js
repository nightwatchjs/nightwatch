describe('Test Using ES6 Async Custom Commands', function() {
  before(browser => {
    browser
      .url('http://localhost');
  });

  it('sampleTest', browser => {
    browser.customCommandInvoke();
    browser.end();
  });
});
