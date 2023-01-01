describe('Mocha tests with failures', function() {

  //this.retries(1);

  beforeEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

  it('demoTest', async function(browser) {
    await browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  });

  it('demoTest2', function (browser) {
    browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .pause(100)
      .assert.elementPresent('#badElement')
      .end();
  });

  it('demoTest3', function (browser) {
    browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });

  afterEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

});
