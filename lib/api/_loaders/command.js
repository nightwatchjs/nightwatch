const EventEmitter = require('events');
const BaseCommandLoader = require('./_base-loader.js');
const Utils = require('../../utils');

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
        if (Utils.isES6AsyncFn(CommandModule.command)) {
          return CommandModule.command.apply(this.api, args);
        }

        setImmediate(async () => {
          CommandModule.command.apply(this.api, args);
        });

        return this.api;
      }
    };
  }

  static transportActions({actions, api}) {
    return new Proxy(actions, {
      get(target, name) {
        return function(...args) {
          let callback;
          let method;
          let isLastArgFunction = Utils.isFunction(args[args.length-1]);

          if (isLastArgFunction) {
            callback = args.pop();
          } else if (args.length === 0 || !isLastArgFunction) {
            callback = function(result) {return result};
          }

          const definition = {
            args
          };

          if (name in target.session) { // actions that require the current session
            method = target.session[name];
            definition.sessionId = api.sessionId;
          } else {
            method = target[name];
          }

          return method(definition).then((result) => Utils.makePromise(callback, api, [result]));
        };
      }
    });
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

      get client() {
        return this.__nightwatchInstance || nightwatchInstance;
      }

      get commandFileName() {
        return opts.commandName;
      }

      get commandArgs() {
        return opts.args;
      }

      get transportActions() {
        return this.client.transportActions;
      }

      httpRequest(requestOptions) {
        return this.client.transport.runProtocolAction(requestOptions);
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
      this.commandFn = function commandFn({args, stackTrace}) {
        const instance = CommandLoader.createInstance(this.nightwatchInstance, this.module, {
          stackTrace,
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
          })
          .then(result => {
            let reportErrors = instance.client.settings.report_command_errors;

            if (result && result.code && result.error && result.status === -1) {
              // node.js errors, e.g. ECONNRESET
              reportErrors = true;
            }

            if (result && result.status === -1 && instance.reportProtocolErrors(result) && reportErrors) {
              const error = new Error(`Error while running .${this.commandName}(): ${result.error}`);
              instance.client.reporter.registerTestError(error);
            }

            return result;
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

  getTargetNamespace(parent) {
    let namespace;
    if (parent) {
      namespace = super.getTargetNamespace(parent);
    } else if (Array.isArray(this.namespace) && this.namespace.length > 0) {
      namespace = BaseCommandLoader.unflattenNamespace(this.api, this.namespace.slice());
    }

    return namespace;
  }
}

module.exports = CommandLoader;
