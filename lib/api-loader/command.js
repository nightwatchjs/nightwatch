const util = require('util');
const events = require('events');
const Logger = require('../util/logger.js');
const BaseCommandLoader = require('./_base-loader.js');

class CommandLoader extends BaseCommandLoader {

  static get interfaceMethods() {
    return {
      command: 'function'
    };
  }

  static isDeprecatedCommandStyle(CommandModule) {
    return typeof CommandModule == 'object' && typeof CommandModule.command == 'function';
  }

  createInstanceFromClass(CommandClass) {
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
   */
  createFromObject(CommandModule) {
    return class CommandClass extends events.EventEmitter {
      command(...args) {
        setImmediate(() => {
          CommandModule.command.apply(this.api, args);
        });

        return this.api;
      }
    };
  }

  createInstance(CommandModule) {
    const mainClass = this;

    const CommandClass = (CommandLoader.isDeprecatedCommandStyle(CommandModule) ?
      this.createFromObject : this.createInstanceFromClass)(CommandModule);

    class CommandInstance extends CommandClass {
      get api() {
        return mainClass.nightwatchInstance.api;
      }

      /**
       * @deprecated
       */
      get client() {
        return mainClass.nightwatchInstance;
      }

      toString() {
        return `${this.constructor.name} [name=${mainClass.commandName}]`;
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
    Object.keys(CommandLoader.interfaceMethods).forEach(method => {
      let type = CommandLoader.interfaceMethods[method];
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

  createWrapper() {
    if (this.module) {
      let moduleDefinition = this.module;
      let command = this;

      this.commandFn = function commandFn(...args) {
        command.stackTrace = commandFn.stackTrace;
        command.createInstance(moduleDefinition);

        return command.executeCommand(...args);
      };
    }

    return this;
  }
}

module.exports = CommandLoader;