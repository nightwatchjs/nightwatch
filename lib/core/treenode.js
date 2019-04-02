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
   * @param {{name, namespace, stackTrace, parent, deferred}} opts
   */
  constructor({name, parent, namespace, stackTrace, deferred, isES6Async}) {
    this.__command = null;
    this.__context = null;
    this.__args = null;
    this.__instance = null;

    // if we have an ES6 async/await testcase, there will be a deferred object containing the promise
    this.deferred = deferred;
    this.hasPromise = deferred !== undefined && isES6Async;
    this.name = name || '__root__';
    this.namespace = namespace;
    this.stackTrace = stackTrace;
    this.parent = parent;

    this.childNodes = [];
    this.started = false;
    this.done = false;
    this.startTime = null;
  }

  resolve(result) {
    if (!this.hasPromise || !this.deferred) {
      return;
    }

    this.deferred.resolve(result);
  }

  reject(reason) {
    if (!this.hasPromise || !this.deferred) {
      return;
    }

    this.deferred.reject(reason);
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
    const commandFn = this.command;
    if (!commandFn) {
      return Promise.resolve();
    }

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
      let originalError = `${err.name}: ${err.message}\n` + Utils.filterStack(err);

      if (this.stackTrace) {
        err.stack = this.stackTrace;
      }

      err.message = `Error while running "${this.name}" command: "${originalError}"`;

      this.result = Promise.reject(err);
    }

    return this.result;
  }

  handleCommandResult() {
    if (!this.deferred) {
      this.deferred = Utils.createPromise();
    }

    let commandResult;

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
