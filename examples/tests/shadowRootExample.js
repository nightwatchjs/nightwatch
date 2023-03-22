describe('Shadow Root example test', function() {

  // Doesn't work in Firefox due to a serialization issue in Geckodriver
  this.disabled = this.settings.desiredCapabilities.browserName === 'firefox';

  it('retrieve the shadowRoot', async function(browser) {
    await browser
      .navigateTo('https://mdn.github.io/web-components-examples/popup-info-box-web-component/')
      .waitForElementVisible('form');

    // const shadowId = browser.element('popup-info').getId().map(val => {
    //   return val + 'shadow';
    // }).assert.contains('shadow');
    // console.log('!!! shadowId', shadowId)

    //const els = browser.element.findAll('form');

    //await expect(shadowId).to.be.a('string').and.to.include('shadow')

    const shadowRootEl = browser.element('popup-info').getShadowRoot();
    const infoElement = shadowRootEl.find('.info').property('innerHTML');

    //console.log('!!! infoElement', infoElement.assert)

    expect(infoElement)
      .to.be.a('string')
      .and.to.include('card validation code');

    const iconElement = await shadowRootEl.find('.icon');
    console.log('!!! iconElement', iconElement)

    const firstElement = await browser.getFirstElementChild(iconElement);

    await expect.element(firstElement).to.be.an('img');

  });
});