var Nightwatch = require('./nightwatch.js');
const fs = require('fs');
const glob = require('glob');

module.exports = {

  /**
   * Monkey-patch run queue run() callbacks to capture errors handled
   * in the queue after they are sent off to the nightwatch instance.
   *
   * @param {function} testCallback The callback used by the test to
   * capture the error object
   */
  catchQueueError: function (testCallback) {
    var queue = Nightwatch.client().queue;

    // queue is a singleton, not re-instancing with new nightwatch
    // instances. In order to re-patch it if patched previously, we
    // restore the original run method from the patch if it exists
    // (which may happen if a patched run never gets called with err)

    if (queue.run.origRun) {
      queue.run = queue.run.origRun;
    }

    function queueRunnerPatched (origCallback) {
      origCallback = origCallback || function noop () {};
      origRun.call(queue, function(err) {
        origCallback(err);
        if (err) {
          queue.run = origRun; // once, since errors are fatal to queue execution
          testCallback(err);
        }
      });
    }

    var origRun = queueRunnerPatched.origRun = queue.run;
    queue.run = queueRunnerPatched;
  },

  getLineBreak: function() {
    return process.platform === 'win32' ? '\r\n' : '\n';
  },

  readFilePromise(pattern) {
    return new Promise(function(resolve, reject) {
      glob(pattern, (error, matches)=> {
        if (error) {
          return reject(error);
        }
        fs.readFile(matches[0], function(err, result) {
          if (err) {
            return reject(err);
          }
          
          return resolve(result);
        });
      });
    });
  },

  readDirPromise(dirName) {
    return new Promise(function(resolve, reject) {
      fs.readdir(dirName, function(err, result) {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  }
};
