describe('Mocha tests with failures', function() {

  //this.retries(1);

  before(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

  beforeEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

  it('demoTest', function (browser) {
    browser.url('http://localhost')
      //.pause(1000)
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
      .pause(100)
      .assert.elementPresent('#weblogin')
      .end();
  });

  afterEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

  after(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });
});
