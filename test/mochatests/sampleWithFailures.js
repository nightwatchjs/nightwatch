describe('Mocha tests with failures', function() {

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
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  });

  it('demoTest2', function (browser) {
    browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
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
