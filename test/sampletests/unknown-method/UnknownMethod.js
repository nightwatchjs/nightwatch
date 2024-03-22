describe('sample test goes here', function () {
  it('failure stack trace', function() {
   
    browser.url('http://localhost')
      .assert.elementPresen('#badElement'); // mispelled API method
  });
}); 