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
  
  'step one' : function (client) {
    client
      .url('http://localhost')
      .waitForElementVisible('body', 1000)
      .accept_alert();
      
      
    client.pause(1000, function() {
      console.info('Paused')
    });
    
    client.assert.title('Test')
      .end();
  }
}
