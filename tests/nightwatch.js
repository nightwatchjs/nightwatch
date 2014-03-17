var nightwatch = require('../index.js');

module.exports = {
  init : function(callback) {
    return nightwatch.client({
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        myGlobal : 'test'
      }
    }).start().once('error', function() {
      if (callback) {
        callback();
      }
      process.exit();
    })
  }
}
