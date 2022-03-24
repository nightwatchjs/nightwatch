describe('expect() tests ', function () {
  const signupSection = element(by.css('#signupSection'));

  after(browser => browser.end());

  it('weblogin has class container ',  async function() {
    const weblogin = element('#weblogin');
    expect(signupSection.isSelected()).to.be.true;
    expect(weblogin.property('className')).to.be.an('array').and.contains('container');
  });



});
