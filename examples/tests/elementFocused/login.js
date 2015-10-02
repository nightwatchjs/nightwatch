module.exports = {
  tags: ['focus'],
  'Demo test login input focusing' : function (client) {
    client
      .url('https://github.com/login')
      .waitForElementFocused('#login_field', 1000)
      //.setValue('#login_field', ['test', client.Keys.ENTER]) // Works with Chrome driver not PhantomJS
      .setValue('#login_field', 'test')
      .click('.auth-form-body .btn')
      .waitForElementNotFocused('#login_field', 1000)
      .waitForElementFocused('#password', 1000)
    ;
  },

  after : function(client) {
    client.end();
  }
};
