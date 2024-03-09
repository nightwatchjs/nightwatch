describe('sample test goes here', function () {
  it('failure stack trace', function() {
   
    browser.url('http://localhost')
      .assert.elementPresent('#badElement'); // mispelled API method
  });
}); 