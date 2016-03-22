var Logger = require('../../util/logger.js');

var ErrorHandler = module.exports = {
  handle : function(err, results, finished) {
    finished = finished || function() {};

    if (results && results.errors) {
      console.log(results.errmessages.join('\n'));
    }

    if (err) {
      Logger.enable();
      if (!err.message) {
        err.message = 'There was an error while running the test.';
      }

      ErrorHandler.logError(err);

      finished(false, results);
      process.exit(1);
    } else {
      var result = true;
      if (results.failed || results.errors) {
        result = false;
      }
      finished(result, results);
    }
  },

  logWarning : function(message) {
    console.warn(Logger.colors.brown(message));
  },

  logError : function(err) {
    if (!err) {
      return;
    }
    var util = require('util');
    console.error('');
    var stackTrace = err && err.stack;
    if (!stackTrace) {
      var data;
      if (err.message) {
        data = err.data;
        err = err.message;
      }

      if (typeof err == 'string') {
        process.stderr.write(Logger.colors.red(err));
        if (data) {
          if (typeof data == 'object' && Object.keys(data).length > 0) {
            data = util.inspect(data);
          }
          process.stderr.write(data + '\n');
        }

        process.stderr.write('\n');
      } else {
        console.error(err);
      }
      return;
    }

    var parts = stackTrace.split('\n');
    process.stderr.write(Logger.colors.red(parts.shift()) + '\n');
    process.stderr.write(parts.join('\n') + '\n\n');
  }
};
