const EventEmitter = require('events');
const BaseCommandLoader = require('./_base-loader.js');
const Utils = require('../util/utils.js');

class CommandLoader extends BaseCommandLoader {

  static get interfaceMethods() {
    return {
      command: 'function'
    };
  }

  static isDeprecatedCommandStyle(CommandModule) {
    return Utils.isObject(CommandModule) && Utils.isFunction(CommandModule.command);
  }

  /**
   * This is to support backwards-compatibility for commands defined as objects,
   *  with a command() property
   *
   * @param CommandModule
   */
  createFromObject(CommandModule) {
    return class CommandClass extends EventEmitter {
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

    const CommandClass = CommandLoader.isDeprecatedCommandStyle(CommandModule) ? this.createFromObject(CommandModule) : CommandModule;

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
          return super.complete(...args);
        }

        args.unshift('complete');

        setImmediate(() => {
          this.emit.apply(this, args);
        });
      }
    }

    this.__instance = new CommandInstance();
    this.__instance.stackTrace = this.stackTrace;
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