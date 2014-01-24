var nightwatch = require('../index.js');

module.exports = {
  init : function() {
    return nightwatch.client({
      port : 10199,
      silent : true,
      output : false
    }).start().once('error', function() {
      process.exit();
    }) 
  } 
}