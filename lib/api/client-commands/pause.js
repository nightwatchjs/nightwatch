const util = require('util');
const EventEmitter = require('events');
const readline = require('readline');
const Debuggability = require('../../utils/debuggability.js');

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
    console.log(`Paused...
  Press <space> or F10 to step over to the next test command and pause again.
  Press Ctrl+C to exit.
  Press any other key to RESUME.`);

    readline.emitKeypressEvents(process.stdin);
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.once('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        this.api.end(function() {
          process.exit(0);
        });
      } else if (key.name === 'space' || key.name === 'f10') {
        Debuggability.stepOverAndPause = true;
      }
      process.stdin.setRawMode(false);
      process.stdin.pause();

      // Remove the logged paused... information above
      readline.moveCursor(process.stdout, 0, -4);
      readline.clearScreenDown(process.stdout);

      if (cb) {
        cb.call(this.client.api);
      }

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
