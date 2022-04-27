const util = require('util');
const EventEmitter = require('events');

/**
 * Suspends the test for the given time in milliseconds. If the milliseconds argument is missing it will suspend the test indefinitely
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.pause(1000);
 *   // or suspend indefinitely
 *   browser.pause();
 * };
 *
 * @method pause
 * @param {number} ms The number of milliseconds to wait.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */

function Pause() {
  EventEmitter.call(this);
}

util.inherits(Pause, EventEmitter);

Pause.prototype.command = function(ms, cb) {
  // If we don't pass the milliseconds, the client will
  // be suspended indefinitely, until the user presses some
  // key in the terminal to resume it.
  if (!ms) {
    // eslint-disable-next-line
    console.log('Waiting... Press any key to resume, or press Ctrl+C to exit.');

    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.once('data', (data) => {
      const byteArray = [...data];
      if (byteArray.length > 0 && byteArray[0] === 3) {
        // Ctrl+C is pressed
        this.api.end(function () {
          process.exit(0);
        });
      }
      process.stdin.setRawMode(false);
      process.stdin.pause();

      this.emit('complete');
    });
  } else {
    setTimeout(() => {
      // if we have a callback, call it right before the complete event
      if (cb) {
        cb.call(this.client.api);
      }
  
      this.emit('complete');
    }, ms);
  }

  return this;
};

module.exports = Pause;
