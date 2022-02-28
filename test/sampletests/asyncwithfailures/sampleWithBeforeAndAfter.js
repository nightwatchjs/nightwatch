describe('Demo test async', function () {

  before(function (browser, done) {
    browser.globals.test_calls++;
    done();
  });

  after(function (browser, done) {
    setTimeout(function () {
      browser.globals.test_calls++;
      done();
    }, 100);
  });

  afterEach(function (browser, done) {
    setTimeout(function () {
      browser.globals.test_calls++;
      done();
    }, 100);
  });

  beforeEach(function (browser, done) {
    setTimeout(function () {
      browser.globals.test_calls++;
      done();
    }, 100);
  });

  it('demoTestAsyncOne', function (browser) {
    browser.url('http://localhost');
  });

  it('demoTestAsyncTwo', function (browser) {
    browser.end();
  });

});