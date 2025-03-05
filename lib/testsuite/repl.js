const repl = require('repl');
const {Logger} = require('../utils');
const vm = require('vm');

module.exports = class NightwatchRepl {
  constructor(config) {
    this._config = Object.assign({
      eval: this._eval.bind(this),
      useGlobal: false, // so that REPL does not create a separate context to pass to eval.
      preview: true,
      timeout: 5500  // timeout for assertions is 5000 ms.
    }, config);
  }

  static introMessage() {
    return `
  DEBUG MODE on...

  Type any Nightwatch command to execute in the browser in real-time.
  Try, ${Logger.colors.cyan('browser.navigateTo(\'https://nightwatchjs.org\');')}

  (To exit, press Ctrl+C twice or type .exit)
  `;
  }

  startServer(context) {
    vm.createContext(context);
    this._context = context;

    // Start REPLServer
    this._replServer = repl.start(this._config);
  }

  _eval(cmd, _, filename, callback) {
    // Evaluate for output previews.
    if (/^try { .+ } catch {}$/.test(cmd)) {
      // if `cmd` represents a method call
      if (cmd.includes('(')) {
        return;
      }

      return this._outputPreview(cmd, callback);
    }

    // A command is already running whose result is awaited.
    if (this._resultAwaited) {
      return;
    }

    try {
      const result = vm.runInContext(cmd, this._context);
      this._handleResult(result, callback);
    } catch (err) {
      const errRegex = /^(Unexpected end of input|Unexpected token)/;
      if (err.name === 'SyntaxError' && errRegex.test(err.message)) {
        return callback(new repl.Recoverable(err));
      }

      Logger.error(err);
      callback();
    }
  }

  async _handleResult(result, callback) {
    const resultIsPromise = result instanceof Promise || (result && typeof result.then === 'function');

    if (!resultIsPromise) {
      return callback(null, result);
    }

    this._resultAwaited = true;

    let timeoutCalled = false;
    const timeoutId = setTimeout(
      () => {
        this._resultAwaited = false;
        timeoutCalled = true;
        Logger.error('Timed out while waiting for response.');
        callback();
      },
      this._config.timeout
    );

    try {
      const res = await result;

      if (timeoutCalled) {
        return;
      }

      clearTimeout(timeoutId);
      this._resultAwaited = false;
      callback(null, res);
    } catch (err) {
      // When the promise is rejected, the error would have
      // already been logged by Nightwatch.
      // TODO: Should we close the REPL server here?

      // Assertions errors would have already been logged
      if (err.name !== 'NightwatchAssertError') {
        Logger.error(err);
      }

      if (timeoutCalled) {
        return;
      }

      clearTimeout(timeoutId);
      this._resultAwaited = false;
      callback();
    }
  }

  _outputPreview(cmd, callback) {
    const regex = /^try { (.+) } catch {}$/;
    const match = cmd.match(regex);

    if (match) {
      const actualCmd = match[1];
      const cmdArray = actualCmd.split('.');
      try {
        const result = cmdArray.reduce((prevCmd, currCmd) => {
          return prevCmd[currCmd];
        }, this._context);

        return callback(null, result);
      } catch (err) {
        return;
      }
    }
  }

  onExit(callback) {
    this._replServer.on('exit', callback);
  }
};
