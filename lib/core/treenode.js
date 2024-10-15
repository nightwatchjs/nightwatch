const EventEmitter = require('events');
const Utils = require('../utils');
const Debuggability = require('../utils/debuggability');

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

  get redact() {
    return !!this.options.redact;
  }

  get isTraceable() {
    return this.options && this.options.isTraceable;
  }

  get fullName() {
    if (!this.namespace || !Utils.isString(this.namespace)) {
      return this.name;
    }

    return `${this.namespace}.${this.name}`;
  }

  get isRootNode() {
    return this.name === '__root__';
  }

  /**
   *
   * @param {function} commandFn
   * @param {object} context
   * @param {Array} args
   * @param {object} options
   */
  setCommand(commandFn, context, args, options = {}) {
    this.__command = commandFn;
    this.__context = context;
    this.__args = args;
    this.options = options;
  }

  /**
   * @param {{name, namespace, stackTrace, parent, deferred}} opts
   */
  constructor({name, parent, namespace, stackTrace, deferred, isES6Async, compatMode, rejectPromise, addedInsideCallback}) {
    this.__command = null;
    this.__context = null;
    this.__args = null;
    this.__instance = null;

    // if we have an ES6 async/await testcase, there will be a deferred object containing the promise
    this.deferred = deferred || Utils.createPromise();
    this.isES6Async = deferred !== undefined && (isES6Async || parent.isES6Async);
    this.name = name || '__root__';
    this.namespace = namespace;
    if (Utils.isFunction(this.namespace)) {
      this.namespace = this.namespace();
    }
    this.stackTrace = stackTrace;
    this.parent = parent;
    this.compatMode = compatMode;

    this.childNodes = [];
    this.started = false;
    this.rejectPromise = rejectPromise;
    this.done = false;
    this.startTime = null;
    this.promiseSettled = false;
    this.addedInsideCallback = addedInsideCallback;
  }

  getResult(result) {
    if (!this.compatMode && Utils.isObject(result) && !Utils.isUndefined(result.status) && !Utils.isUndefined(result.value)) {
      return result.value;
    }

    return result;
  }

  resolve(result) {
    if (this.promiseSettled || !this.deferred) {
      return;
    }

    this.promiseSettled = true;
    this.deferred.resolve(this.getResult(result));
  }

  reject(reason) {
    if (this.promiseSettled || !this.deferred) {
      return;
    }

    this.promiseSettled = true;
    this.deferred.reject(reason);
  }

  run() {
    return this.runCommand();
  }

  handleError(err) {
    // Set abortOnFailure to false when command is being executed in debugMode
    if (Debuggability.debugMode) {
      err.abortOnFailure = false;
    } else {
      err.abortOnFailure = err.abortOnFailure || err.abortOnFailure === undefined;
    }

    const errorName = err.name !== 'Error' ? `[${err.name}] ` : '';
    const originalError = `${errorName}${err.message}`;

    if (this.stackTrace && Utils.shouldReplaceStack(err)) {
      err.stack = this.stackTrace;
    }

    if (err.name !== 'NightwatchAssertError' && err.name !== 'NightwatchMountError') {
      err.message = `Error while running "${this.fullName}" command: ${originalError}`;
    }


    return err;
  }

  async runCommand() {
    this.started = true;
    this.startTime = new Date().getTime();

    let result;
    try {
      result = await this.execute();
    } catch (err) {
      result = err;
    }

    this.done = true;
    this.endTime = new Date().getTime();
    this.elapsedTime =  this.endTime - this.startTime;

    return result;
  }

  invokeCommand() {
    const {args, stackTrace, options, command} = this;
    command.stackTrace = stackTrace;

    this.__instance = command.call(this.context, {args, stackTrace, options});

    return this.__instance;
  }

  execute(autoInvoke = false) {
    const commandFn = this.command;
    if (!commandFn) {
      return Promise.resolve();
    }

    if (autoInvoke) {
      let result;
      try {
        result = this.invokeCommand();
      } catch (err) {
        result = err;
      }

      return result;
    }

    return new Promise((resolve) => {
      this.invokeCommand();

      if (this.instance instanceof Promise) {
        this.instance
          .then(result => resolve(result))
          .catch(err => resolve(err));

        return;
      }

      this.handleCommandResult((result) => {
        resolve(result);
      }, (err) => {
        resolve(err);
      });
    });
  }

  handleCommandResult(resolveFn, rejectFn) {
    let commandResult;

    if (this.instance instanceof EventEmitter) {
      commandResult = this.instance;
      if (this.instance.needsPromise) {
        this.needsPromise = true;
        commandResult = this.context;
      }
    } else if (this.context instanceof EventEmitter) { // Chai assertions
      commandResult = this.context;
      // this is for when the command is not emitting an event itself, but has child nodes that may do,
      //  so when all the child nodes will finish, the parent will also finish
      this.needsPromise = true;
    }

    if (!commandResult) {
      rejectFn(new Error('Commands must either return an EventEmitter which emits a "complete" event or a Promise.'));

      return;
    }

    const completeHandler =  result => {
      commandResult.removeListener('error', errorHandler);
      resolveFn(result);
    };

    const errorHandler = (err, abortOnFailure) => {
      err.abortOnFailure = abortOnFailure || abortOnFailure === undefined;
      commandResult.removeListener('complete', completeHandler);
      rejectFn(err);
    };

    commandResult.once('complete', completeHandler);
    commandResult.once('error', errorHandler);
  }
}

module.exports = TreeNode;
