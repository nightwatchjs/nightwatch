
describe('Mocha tests with failures', function() {

  beforeEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

  it('demoTest', async function(browser) {
    await browser.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });

  afterEach(function(browser, callback) {
    browser.globals.test_calls++;
    callback();
  });

});
