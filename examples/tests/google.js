/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to google.com and searches for nightwatch,
 *   verifying if the term 'The Night Watch' exists in the search results
 */

module.exports = {
  setUp : function(c) {
    console.log('Setting up...');
  },

  tearDown : function() {
    console.log('Closing down...');
  },

  'demo test google' : function (client) {
    client
      .url('http://google.com')
      .waitForElementPresent('body', 1000)
      .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('#main', 'The Night Watch')
      .end();
  }
};

