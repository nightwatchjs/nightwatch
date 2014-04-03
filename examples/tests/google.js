/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to google.com and searches for nightwatch,
 *   verifying if the term 'The Night Watch' exists in the search results
 */

module.exports = {
  setUp : function(c) {
    this.client.assert.equal(c.globals.myGlobal, 1, 'checking globals are loaded.');
  },

  tearDown : function() {
    console.log('Closing down...');
  },

  'demo test google' : function (client) {
    client
      .url('http://google.com')
      .waitForElementPresent('body', 1000)
      .setValue('input[type=text]', 'nightwatch', function() {
        this
          .waitForElementVisible('button[name=btnG]', 1000)
          .click('button[name=btnG]', function() {
            this
              .pause(500)
              .assert.containsText('#main', 'The Night Watch');
          });
      }).end();
  }
};

