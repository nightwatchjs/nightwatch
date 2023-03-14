describe('cdp tests', function() {
  it('register basic auth', function() {
    browser.registerBasicAuth('admin', 'admin')
      .navigateTo('http://localhost');
  });
});