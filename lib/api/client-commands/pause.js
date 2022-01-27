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
  // be suspended indefinitely
  if (!ms) {
    ms = 1000 * 60 * 60 * 6; // 6 hours
    // eslint-disable-next-line
    console.log('Waiting... Press Ctrl+C to exit.');
    process.on('SIGINT', (code) => {
      this.api.end(function () {
        process.exit(0);
      });
    });
  }

  setTimeout(() => {
    // if we have a callback, call it right before the complete event
    if (cb) {
      cb.call(this.client.api);
    }

    this.emit('complete');
  }, ms);

  return this;
};

module.exports = Pause;
