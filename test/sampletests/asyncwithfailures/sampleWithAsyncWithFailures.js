describe('Mocha tests with failures', function() {

  beforeEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

  it('demoTest', async function(browser) {
    await browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .assert.elementPresent('#weblogin')
      .end();
  });

  it('demoTest2', function (browser) {
    browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .pause(100)
      .assert.elementPresent('#badElement')
      .end();
  });

  it('demoTest3', async function(browser) {
    browser.url('http://localhost')
      .waitForElementPresent('#weblogin')
      .waitForElementPresent('#badlogin')
      .end();
  });

  it('demoTest4', async function(browser) {
    await browser.url('http://localhost')
      .waitForElementPresent('#weblogin')
      .pause(100)
      .waitForElementPresent('#badelement')
      .end();
  });

  afterEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

});
