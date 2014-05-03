/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to google.com and searches for nightwatch,
 *   verifying if the term 'The Night Watch' exists in the search results
 */

module.exports = {
  'demo test google' : function (client) {
    client
      .url('http://google.com')
      .waitForElementPresent('body', 1000)
      .setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
      .pause(1000)
      .assert.containsText('#main', 'The Night Watch')
      .pause(1000)
      .execute("return google.timers;", function(result){
        this.assert.ok(typeof result.value === 'function'); //forcing failure
      })
      .end();
  }
};
