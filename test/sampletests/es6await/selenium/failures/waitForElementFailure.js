const {after} = require('lodash');

module.exports= {
 

  'demoTest': async function(client) {
    await client.waitForElementVisible({
      selector: '#badElement',
      timeout: 15,
      retryInterval: 15,
      abortOnFailure: false
    });
    client.end();
  }
  
  
};