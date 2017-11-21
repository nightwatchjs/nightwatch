const path = require('path');
const events = require('events');
const Reporter = require('../core/reporter.js');
const CommandQueue = require('../core/queue.js');

const VALID_FILENAME_EXT = '.js';

class BaseLoader extends events.EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.__namespace = null;
    this.__module = null;
    this.__commandName = null;
    this.__commandFn = null;
    this.__instance = null;

    this.nightwatchInstance = nightwatchInstance;
    this.api = nightwatchInstance.api;
  }

  get module() {
    return this.__module;
  }

  get commandName() {
    return this.__commandName;
  }

  get namespace() {
    return this.__namespace;
  }

  get commandFn() {
    return this.__commandFn;
  }

  set commandFn(val) {
    this.__commandFn = val;
  }

  set commandName(val) {
    this.__commandName = val;
  }

  set stackTrace(val) {
    this.__stackTrace = val;
  }

  get stackTrace() {
    return this.__stackTrace;
  }

  get instance() {
    return this.__instance;
  }

  setNamespace(val) {
    this.__namespace = val;

    return this;
  }

  static getOriginalStrackTrace(commandFn) {
    let originalStackTrace;

    if (commandFn.stackTrace) {
      originalStackTrace = commandFn.stackTrace;
    } else {
      let err = new Error;
      Error.captureStackTrace(err, commandFn);
      originalStackTrace = err.stack;
    }

    return originalStackTrace;
  }

  static isFileNameValid(fileName) {
    return path.extname(fileName) === VALID_FILENAME_EXT;
  }

  isTypeImplemented(method, type) {
    if (type === '*') {
      return this.instance[method] !== undefined;
    }

    return typeof this.instance[method] == type;
  }

  loadModule(dirPath, fileName) {
    if (!BaseLoader.isFileNameValid(fileName) || fileName.startsWith('_')) {
      return this;
    }

    this.commandName = path.basename(fileName, VALID_FILENAME_EXT);

    try {
      this.__module = require(path.join(dirPath, fileName));
    } catch (err) {
      let error = new Error(`There was an error while trying to load the file ${fileName}:\n${err.stack}`);
      Reporter.registerTestError(error);
      throw error;
    }

    return this;
  }

  createWrapperInstance(CommandWrapperClass) {
    let command = new CommandWrapperClass(this.nightwatchInstance);
    command.name = this.commandName;

    return command;
  }

  define() {
    if (!this.commandFn) {
      return this;
    }

    if (this.nightwatchInstance.isApiMethodDefined(this.commandName, this.namespace)) {
      let error = new Error(`The command/assertion ${this.namespace || ''}.${this.commandName}() is already defined.`);
      Reporter.registerTestError(error);
      throw error;
    }

    let commandName = this.commandName;
    let command = this.commandFn;

    let args = [function commandFn(...args) {
      let originalStackTrace = BaseLoader.getOriginalStrackTrace(commandFn);

      CommandQueue.add(commandName, command, this, args, originalStackTrace);

      return this;
    }.bind(this.nightwatchInstance.api)];

    if (this.namespace) {
      args.unshift(this.namespace);
    }

    this.nightwatchInstance.setApiMethod(this.commandName, ...args);

    return this;
  }
}

module.exports = BaseLoader;