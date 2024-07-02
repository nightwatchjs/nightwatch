const EventEmitter = require('events');
const readline = require('readline');
const Debuggability = require('../../utils/debuggability.js');

/**
 * pause() command provides the following functionalities:
 * - Pause the test execution for the given time in milliseconds.
 * - Pause the test execution indefinitely, until resumed by pressing a key in terminal.
 * - Pause the test execution, and then step over to the next test command (execute the next test command) and pause again.
 *
 * This command will allow you to pause the test execution in between, hop on to the browser to check the state of your
 * application (or use DevTools to debug), and once satisfied, either resume the test execution from where it was left
 * off or step over to the next test command (execute the next test command) and pause again.
 *
 * Stepping over to the next test command would allow you to see what exactly changed in your application when the next
 * test command was executed. You can also use DevTools to monitor those changes, like the network calls that were made
 * during the execution of that command, etc.
 *
 * @example
 * this.demoTest = function (browser) {
 *   // pause for 1000 ms
 *   browser.pause(1000);
 *   // pause indefinitely until resumed
 *   browser.pause();
 * };
 *
 * @method pause
 * @param {number} [ms] The number of milliseconds to wait.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */
class Pause extends EventEmitter {

  command(ms, callback) {
    // If we don't pass the milliseconds, the client will
    // be suspended indefinitely, until the user presses some
    // key in the terminal to resume it.
    if (ms === undefined) {
      // eslint-disable-next-line
      console.log(`Paused...
    Press <space> or F10 to step over to the next test command and pause again.
    Press d to enter the DEBUG mode.
    Press Ctrl+C to exit.
    Press any other key to RESUME.`);

      readline.emitKeypressEvents(process.stdin);
      process.stdin.resume();
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }
      process.stdin.once('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
          this.api.end(function() {
            process.exit(0);
          });
        } else if (key.name === 'space' || key.name === 'f10') {
          Debuggability.stepOverAndPause = true;
        } else if (key.name === 'd') {
          this.api.debug();
        }

        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.pause();

        // Remove the logged paused... information above
        readline.moveCursor(process.stdout, 0, -5);
        readline.clearScreenDown(process.stdout);

        if (callback) {
          callback.call(this.client.api);
        }

        this.emit('complete');
      });
    } else {
      setTimeout(() => {
        // if we have a callback, call it right before the complete event
        if (callback) {
          callback.call(this.client.api);
        }

        this.emit('complete');
      }, ms);
    }

    return this;
  }
}

module.exports = Pause;
