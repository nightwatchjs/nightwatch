describe('Render Vue Component test', function() {
  let formComponent;

  it('checks the vue component', async function(browser) {
    formComponent = await browser.mountComponent('/test/components/Form.vue', {});
    await browser.expect.element(formComponent).to.be.visible;
  });
});