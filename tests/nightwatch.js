var nightwatch = require('../index.js');

module.exports = {
  init : function(options, callback) {
    var opts = {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        myGlobal : 'test'
      }
    };

    if (options) {
      for (var prop in options) {
        opts[prop] = options[prop];
      }
    }

    return nightwatch.client(opts)
      .on('selenium:session_create', function() {
        if (callback) {
          callback();
        }
      })
      .once('error', function() {
        if (callback) {
          callback();
        }
        process.exit();
      }).start();
  }
};
