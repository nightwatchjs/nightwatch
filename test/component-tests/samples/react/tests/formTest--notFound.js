describe('Render React Component test', function() {
  let formComponent;

  it('checks the react component', async function(browser) {
    formComponent = await browser.mountComponent('/test/components/Form.jsx', {});
    await browser.expect.element(formComponent).to.be.visible;
  });
});