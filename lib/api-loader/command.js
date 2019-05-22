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
  static createFromObject(CommandModule) {
    return class CommandClass extends EventEmitter {
      command(...args) {
        setImmediate(() => {
          CommandModule.command.apply(this.api, args);
        });

        return this.api;
      }
    };
  }

  static createInstance(nightwatchInstance, CommandModule, opts) {
    const CommandClass = CommandLoader.isDeprecatedCommandStyle(CommandModule) ? CommandLoader.createFromObject(CommandModule) : CommandModule;

    class CommandInstance extends CommandClass {
      get api() {
        const isES6Async = this.isES6AsyncCommand;

        return {
          ...nightwatchInstance.api,
          get isES6Async() {
            return isES6Async;
          }
        };
      }

      get isES6AsyncCommand() {
        return Utils.isES6AsyncFn(
          CommandLoader.isDeprecatedCommandStyle(CommandModule) ? CommandModule.command: this.command
        );
      }

      /**
       * @deprecated
       */
      get client() {
        return nightwatchInstance;
      }

      get commandFileName() {
        return opts.commandName;
      }

      get commandArgs() {
        return opts.args;
      }

      toString() {
        return `${this.constructor.name} [name=${opts.commandName}]`;
      }

      complete(...args) {
        if (Utils.isFunction(super.complete)) {
          return super.complete(...args);
        }

        this.emit('complete', ...args);
      }
    }

    const instance = new CommandInstance();

    Object.keys(CommandLoader.interfaceMethods).forEach(method => {
      let type = CommandLoader.interfaceMethods[method];
      if (!BaseCommandLoader.isTypeImplemented(instance, method, type)) {
        throw new Error(`Command class must implement method .${method}()`);
      }
    });

    instance.stackTrace = opts.stackTrace;
    instance.needsPromise = CommandLoader.isDeprecatedCommandStyle(CommandModule);

    return instance;
  }

  get loadSubDirectories() {
    return true;
  }

  createWrapper() {
    if (this.module) {
      this.commandFn = function commandFn(...args) {
        const instance = CommandLoader.createInstance(this.nightwatchInstance, this.module, {
          stackTrace: commandFn.stackTrace,
          args,
          commandName: this.commandName
        });

        const result = this.resolveElementSelector(args)
          .then(elementResult => {
            if (elementResult) {
              args[0] = elementResult;
            }

            return instance.command(...args);
          })
          .catch(err => {
            if (instance instanceof EventEmitter) {
              instance.emit('error', err);
              return;
            }

            throw err;
          });

        if (instance instanceof EventEmitter) {
          return instance;
        }

        if (result instanceof Promise) {
          return result;
        }

        return result;
      };
    }

    return this;
  }

  define(parent = null) {
    if (!this.commandFn) {
      return this;
    }

    this.validateMethod(parent);

    const {commandName, api, nightwatchInstance, commandQueue} = this;
    const commandFn = this.commandFn.bind(this);

    const args = [function queuedCommandFn(...args) {
      const originalStackTrace = CommandLoader.getOriginalStackTrace(queuedCommandFn);
      const deferred = Utils.createPromise();

      // if this command was called from another async (custom) command
      const isAsyncCommand = this.isES6Async;

      // if this command was called from an async test case
      const isES6Async = Utils.isUndefined(this.isES6Async) ? nightwatchInstance.isES6AsyncTestcase : isAsyncCommand;

      const node = commandQueue.add({
        commandName,
        commandFn,
        context: this,
        args,
        originalStackTrace,
        namespace,
        deferred,
        isES6Async
      });

      if (isES6Async) {
        return node.deferred.promise;
      }

      return api;
    }];

    let namespace;
    if (parent) {
      namespace = this.getTargetNamespace(parent);
    } else if (Array.isArray(this.namespace) && this.namespace.length > 0) {
      namespace = BaseCommandLoader.unflattenNamespace(api, this.namespace.slice());
    }

    if (namespace) {
      args.unshift(namespace);
    }

    this.nightwatchInstance.setApiMethod(this.commandName, ...args);
    if (this.module && this.module.AliasName) {
      this.nightwatchInstance.setApiMethod(this.module.AliasName, ...args);
    }

    return this;
  }
}

module.exports = CommandLoader;
