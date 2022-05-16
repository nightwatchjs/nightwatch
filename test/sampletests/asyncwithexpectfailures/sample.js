describe('browse.expect with failures in async step', function() {
  it('async step failure', async function() {
    browser.url('http://localhost');
    browser.expect.element('#weblogin').to.be.contain.text('some text');
  });

  it('second step without failure', function() {
    browser.url('http://localhost');
    browser.expect.element('#weblogin').to.be.present;
  });
});