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
      .url('http://google.com');
      
    client.waitForElementVisible('body', 1000);
    
    client.getLocation("input[type=text]", function(result) {
      console.log(result)
      //this.assert.equal(typeof result, "object", "is object");
      //this.assert.equal(result.value.height, 20, 'is 20');
    });
    
    client.assert.title('Google');
    
    client.url(function(result) {
      this.assert.ok(result.value.indexOf('google.nl') !== -1, 'Google url is ok');    
    });
      
    client.assert.visible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('button[name=btnG]', 1000)
      //.setValue('input[type=text]', '2 nightwatch')
  },
  
  'step two' : function (client) {
    client
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('#main', 'The Night Watch')
      .end();
  }
}
