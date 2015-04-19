module.exports = {
  tags: ['google'],
  'Demo test Google' : function (client) {
    client
      .page.google().goToGoogle()
      .assert.title('Google')
      .assert.visible('input[name="q"]')
      .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('#main', 'Night Watch')
      .end();
  }
};
