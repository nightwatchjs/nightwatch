describe('element commands with incorrect args', function() {
  it('getElementProperty', async function(browser) {
    await browser.getElementProperty('aside');
  })
})