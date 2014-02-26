/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to google.com and searches for nightwatch,
 *   verifying if the term 'The Night Watch' exists in the search results
 */

module.exports = {
  setUp : function(c) {
<<<<<<< HEAD
  	console.log('Setting up...');
=======
    console.log('Setting up...');
>>>>>>> master
  },

  tearDown : function() {
    console.log('Closing down...');
  },

  'step one' : function (client) {
    client
      .url('http://google.com')
      .waitForElementVisible('body', 1000)
      .assert.title('Google')
      .url(function(result) {
<<<<<<< HEAD
        this.assert.ok(result.value.indexOf('google.nl') !== -1, 'Google url is ok');
=======
        //this.assert.ok(result.value.indexOf('google.') !== -1, 'Google url is ok');
>>>>>>> master
      })
      .assert.visible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('button[name=btnG]', 1000);
  },

  'step two' : function (client) {
    client
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('#main', 'The Night Watch')

  }
<<<<<<< HEAD


}
=======
};
>>>>>>> master
