const EventEmitter = require('events');
const Utils = require('../util/utils.js');

class TreeNode {
  get command() {
    return this.__command;
  }

  get context() {
    return this.__context;
  }

  get args() {
    return this.__args;
  }

  get instance() {
    return this.__instance;
  }

  get fullName() {
    if (!this.namespace || !Utils.isString(this.namespace)) {
      return this.name;
    }

    return `${this.namespace}.${this.name}`;
  }

  /**
   *
   * @param {function} commandFn
   * @param {object} context
   * @param {Array} args
   */
  setCommand(commandFn, context, args) {
    this.__command = commandFn;
    this.__context = context;
    this.__args = args;
  }

  /**
   * @param {{name, namespace, stackTrace, parent}} opts
   */
  constructor(opts = {}) {
    this.__command = null;
    this.__context = null;
    this.__args = null;

    this.name = opts.name || '__root__';
    this.childNodes = [];
    this.namespace = opts.namespace;
    this.stackTrace = opts.stackTrace;
    this.started = false;
    this.done = false;
    this.startTime = null;
    this.parent = opts.parent;
    this.__instance = null;
  }

  run() {
    return this.runCommand()
      .catch(err => {
        return err;
      })
      .then(result => {
        this.done = true;
        this.elapsedTime = new Date().getTime() - this.startTime;

        return result;
      });
  }

  execute() {
    let commandFn = this.command;
    if (commandFn.prototype) {
      commandFn.prototype.constructor.stackTrace = this.stackTrace;
    }

    this.__instance = commandFn.apply(this.context, this.args);

    if (!commandFn.prototype) {
      this.__instance.stackTrace = this.stackTrace;
    }

    return (this.instance instanceof Promise) ? this.instance : this.handleCommandResult();
  }

  runCommand() {
    this.started = true;
    this.startTime = new Date().getTime();
    this.result = null;

    try {
      this.result = this.execute().catch(err => {
        err.message = `Error while running "${this.name}" command: ${err.message}`;
        err.abortOnFailure = err.abortOnFailure || err.abortOnFailure === undefined;

        if (err.abortOnFailure) {
          throw err;
        }

        return err;
      });

    } catch (err) {
      let originalError = err.stack;

      if (this.stackTrace) {
        err.stack = this.stackTrace;
      }

      err.message = `Error while running "${this.name}" command: "${originalError.split('\n')[0]}"`;

      this.result = Promise.reject(err);
    }

    return this.result;
  }

  handleCommandResult() {
    let commandResult;
    this.deferred = Utils.createPromise();

    if (this.instance instanceof EventEmitter) {
      commandResult = this.instance;
      if (this.instance.needsPromise) {
        this.needsPromise = true;
      }
    } else if (this.context instanceof EventEmitter) { // Chai assertions
      commandResult = this.context;
      // this is for when the command is not emitting an event itself, but has child nodes that may do,
      //  so when all the child nodes will finish, the parent will also finish
      this.needsPromise = true;
    }

    if (!commandResult) {
      throw new Error('Commands must either return an EventEmitter which emits a "complete" event or a Promise.');
    }

    commandResult
      .once('complete', result => {
        this.deferred.resolve(result);
      })
      .once('error', (err, abortOnFailure) => {
        err.abortOnFailure = abortOnFailure || abortOnFailure === undefined;
        this.deferred.reject(err);
      });

    return this.deferred.promise;
  }
}

module.exports = TreeNode;