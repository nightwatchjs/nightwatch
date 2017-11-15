const util = require('util');
const events = require('events');
const BaseCommand = require('./base-command.js');
const Logger = require('../../util/logger.js');

class NightwatchCommand extends BaseCommand {

  static get interfaceMethods() {
    return {
      command: 'function'
    };
  }

  get moduleArgs() {
    return this.__moduleArgs;
  }

  createInstanceFromClass(CommandClass, moduleArgs) {
    util.inherits(CommandClass, events.EventEmitter);

    return class CommandInstance extends CommandClass {
      constructor() {
        super();

        events.EventEmitter.call(this);
      }
    };
  }

  /**
   * This is to support backwards-compatibility for commands defined as objects,
   *  with a command() property
   *
   * @param CommandModule
   * @param moduleArgs
   */
  createFromObject(CommandModule, moduleArgs) {
    return class CommandInstance extends events.EventEmitter {
      command(...args) {
        setImmediate(() => {
          CommandModule.command.apply(this.api, args);
        });

        return this.api;
      }
    }
  }

  static isDeprecatedCommandStyle(CommandModule) {
    return typeof CommandModule == 'object' && typeof CommandModule.command == 'function';
  }

  createInstance(CommandModule, moduleArgs) {
    this.__moduleArgs = moduleArgs;
    const nightwatchInstance = this.nightwatchInstance;

    const CommandClass = (NightwatchCommand.isDeprecatedCommandStyle(CommandModule) ?
      this.createFromObject : this.createInstanceFromClass)(CommandModule, moduleArgs);

    class CommandInstance extends CommandClass {
      get api() {
        return nightwatchInstance.api;
      }

      /**
       * @deprecated
       */
      get client() {
        return nightwatchInstance;
      }

      complete(...args) {
        if (typeof super.complete == 'function') {
          Logger.warn('Warning: overriding base class method .complete().');

          return super.complete(...args);
        }

        args.unshift('complete');

        setImmediate(() => {
          this.emit.apply(this, args);
        });
      }
    }

    this.__instance = new CommandInstance();
  }

  executeCommand(...args) {
    Object.keys(NightwatchCommand.interfaceMethods).forEach(method => {
      let type = NightwatchCommand.interfaceMethods[method];
      if (!this.isTypeImplemented(method, type)) {
        throw new Error(`Command class must implement method .${method}()`);
      }
    });

    return this.runCommand(...args);
  }

  runCommand(...args) {
    this.instance.command(...args);

    return this.instance;
  }
}

module.exports = NightwatchCommand;
