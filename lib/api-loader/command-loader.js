const path = require('path');
const Reporter = require('../core/reporter.js');
const CommandQueue = require('../core/queue.js');
const NightwatchCommand = require('./command/command.js');

const VALID_FILENAME_EXT = '.js';

class CommandLoader {
  constructor(nightwatchInstance) {
    this.__context = null;
    this.__namespace = null;
    this.__module = null;
    this.__commandName = null;
    this.__commandFn = null;

    this.nightwatchInstance = nightwatchInstance;
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

  loadModule(dirPath, fileName) {
    if (!CommandLoader.isFileNameValid(fileName) || fileName.startsWith('_')) {
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

  createWrapper() {
    if (this.module) {
      let moduleDefinition = this.module;
      let command = new NightwatchCommand(this.nightwatchInstance);

      this.commandFn = function commandFn(...args) {
        command.stackTrace = commandFn.stackTrace;
        command.createInstance(moduleDefinition, args);

        return command.executeCommand(...args);
      };
    }

    return this;
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
      let originalStackTrace = CommandLoader.getOriginalStrackTrace(commandFn);

      CommandQueue.add(commandName, command, null, args, originalStackTrace);

      return this;
    }.bind(this.nightwatchInstance.api)];

    if (this.namespace) {
      args.unshift(this.namespace);
    }

    this.nightwatchInstance.setApiMethod(this.commandName, ...args);

    return this;
  }
}

module.exports = CommandLoader;