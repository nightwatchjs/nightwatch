describe('Shadow Root example test', function() {

  // Doesn't work in Firefox due to a serialization issue in Geckodriver
  this.disabled = this.settings.desiredCapabilities.browserName === 'firefox';

  it('retrieve the shadowRoot', async function(browser) {
    await browser
      .navigateTo('https://mdn.github.io/web-components-examples/popup-info-box-web-component/')
      .waitForElementVisible('form');

    const shadowRootEl = await browser.getShadowRoot('popup-info');
    const infoElement = await shadowRootEl.find('.info');

    await expect(infoElement.property('innerHTML'))
      .to.be.a('string')
      .and.to.include('card validation code');

    const iconElement = await shadowRootEl.find('.icon');
    const firstElement = await browser.getFirstElementChild(iconElement);

    await expect.element(firstElement).to.be.an('img');

  });
});