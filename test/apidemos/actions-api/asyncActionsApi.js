describe('Async perform Actions API demo tests', function() { 
  test('browser.perform( async fn )', async browser => {
    const result = await browser.perform(async function() {
      const webelement = await element('#weblogin').findElement();
      const actions = this.actions({async: true});

      return actions.click(webelement);
    });
  });
});