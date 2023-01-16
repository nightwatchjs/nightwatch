describe('form test', function() {
  let component;

  before(async () => {
    component = await browser.mountComponent('/test/component-tests/samples/vue/src/Form.vue');
  });

  it('should render a form component without error', async function() {
    await browser.expect(component).to.be.visible;
  });
});