var Nightwatch = require('./nightwatch.js');    
const fs = require('fs');

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

    function queueRunnerPatched(origCallback) {
      origCallback = origCallback || function noop() {};
      origRun.call(queue, function (err) {
        origCallback(err);
        if (err) {
          queue.run = origRun; // once, since errors are fatal to queue execution
          testCallback(err);
        }
      });
    }

    var origRun = (queueRunnerPatched.origRun = queue.run);
    queue.run = queueRunnerPatched;
  },

  /**
   * Return list of files present in a directory
   *
   * @param {string} dir directory path
   * @param {string} [files_] files array
   * @return list of files in a directory
   */
  getFiles: function (dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (const i in files) {
      const name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
        this.getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }

    return files_;
  }
};
