var nightwatch = require('../index.js');

module.exports = {
  init : function() {
    return nightwatch.remote({
      port : 9999,
      silent : true,
      output : false
    }).start();  
  } 
}