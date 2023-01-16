describe('Checkout Test', function () {
  before((browser) => browser.navigateTo('https://www.bstackdemo.com/'));

  it('checkout products on bstackdemo.com', function (browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('StackDemo')
      // Filter Google from the avaialble filters
      .click('input[value=\'Google\'] + span')
      .assert.selected('input[value=\'Google\']')
      // Add different phones to cart
      .click('[id="17"] .shelf-item__buy-btn')
      .click('[id="18"] .shelf-item__buy-btn')
      .assert.elementsCount('.float-cart__shelf-container .shelf-item', 2)
      // Click checkout
      .click('.buy-btn')
      // Loging with given credentials
      .setValue('#username input', ['demouser', browser.Keys.ENTER])
      .setValue('#password input', ['testingisfun99', browser.Keys.ENTER])
      .click('#login-btn')
      // Fill shipping details
      .setValue('#firstNameInput', 'John')
      .setValue('#lastNameInput', 'Doe')
      .setValue('#addressLine1Input', 'localhost')
      .setValue('#provinceInput', 'local')
      .setValue('#postCodeInput', '127001')
      .click('#checkout-shipping-continue')
      // Check order successfully placed
      .assert.textEquals('#confirmation-message', 'Your Order has been successfully placed.');
  });

  after((browser) => browser.end());
});
