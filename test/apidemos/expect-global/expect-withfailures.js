
describe('expect() tests ', function () {

  after(browser => browser.end());
  
  it('weblogin has class container ', async function() {
    await browser.expect.element('#signupSection').not.to.be.selected;
    await browser.expect.element('#weblogin').to.have.property('className').contains('container');
  });
  
});
  