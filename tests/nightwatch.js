var nightwatch = require('../index.js');

module.exports = {
  init : function(callback) {
    return nightwatch.client({
      selenium_port : 10195,
      silent : true,
      output : false
    }).start().once('error', function() {
      if (callback) {
        callback();
      }
      process.exit();
    }) 
  } 
}