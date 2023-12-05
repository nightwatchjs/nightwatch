describe('Shadow Root example test', function() {
  it('retrieve the shadowRoot', async function(browser) {
    browser
      .navigateTo('https://mdn.github.io/web-components-examples/popup-info-box-web-component/')
      .waitForElementVisible('form');

    // const shadowId = browser.element('popup-info').getId().map(val => {
    //   return val + 'shadow';
    // }).assert.contains('shadow');
    // console.log('!!! shadowId', shadowId)

    // const elForm = await browser.element.findAllByText('Pop-up info widget', {exact: false}).nth(0);
    // expect(elForm).to.be.a('h1');

    // const elForm = await browser.element.findAll('form').nth(0);
    // expect(elForm).to.be.a('form');

    // const formCount = await browser.element.findAll('form').count();
    // expect(formCount).to.equal(1);
    //
    // const elInput = await browser.element.find('form').find('input');
    // console.log('!!! elInput', elInput);
    //expect(elInput).to.be.an('input');



    // const els = await browser.element.findAll('form').count();
    // console.log('!!! els', els);
    //
    // //await expect(shadowId).to.be.a('string').and.to.include('shadow')
    //

    // no `await` used since `shadowRootEl` is going to be chained further
    const shadowRootEl = browser.element('popup-info').getShadowRoot();
    const infoElement = shadowRootEl.find('.info').property('innerHTML');
    //
    // //console.log('!!! infoElement', infoElement.assert)
    //
    // expect(infoElement)
    //   .to.be.a('string')
    //   .and.to.include('card validation code');
    //
    // const iconElement = await shadowRootEl.find('.icon');
    // console.log('!!! iconElement', iconElement)
    //
    // const firstElement = await browser.getFirstElementChild(iconElement);
    //
    // await expect.element(firstElement).to.be.an('img');

  });
});
