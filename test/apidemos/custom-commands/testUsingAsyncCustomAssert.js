describe('custom command using assert', function () {
  it('element visible using custom command', async function() {
    await browser.customVisible('#weblogin');
  });
});