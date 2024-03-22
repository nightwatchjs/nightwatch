describe('sampleTestWithServerError', function() {
  beforeEach(() => {
    // FIXME: when disabling testcases with xit() or xtest(), test hooks should also be skipped
    // console.log('before each')
  });

  it('demoTestWithElementCommand', client => {
    client.getTagName('#element-server-error');
  });

  it('demoTest', client => {
    client.assert.not.elementPresent('#element-server-error');
  });

  it('demoTestWithExpect', client => {
    client.expect.element('#element-server-error').not.present;
  });

  it('demoTestWithWaitForElement', client => {
    client.waitForElementNotPresent('#element-server-error');
  });



  after(client => {
    client.end();
  });
});

