const chai = require('chai-nightwatch');
const path = require('path');
const fs = require('fs');
const Utils = require('../../utils');
const BaseCommandLoader = require('./_command-loader.js');
const ExpectAssertionLoader = require('./expect-assertion.js');

class ExpectLoader extends BaseCommandLoader {
  static get interfaceMethods() {
    return {
      command: 'function'
    };
  }

  static createInstance(nightwatchInstance, CommandModule, opts) {
    const commandInstance = new CommandModule({
      nightwatchInstance,
      commandName: opts.commandName,
      commandArgs: opts.args
    });

    Object.keys(ExpectLoader.interfaceMethods).forEach(method => {
      const type = ExpectLoader.interfaceMethods[method];
      if (!BaseCommandLoader.isTypeImplemented(commandInstance, method, type)) {
        throw new Error(`Command class must implement method .${method}()`);
      }
    });

    return commandInstance;
  }

  createWrapper(abortOnFailure) {
    if (this.module) {
      this.abortOnFailure = abortOnFailure;
      const commandName = this.commandName;

      this.commandFn = function commandFn({args, stackTrace}) {
        this.stackTrace = stackTrace;

        const flagsOk = this.checkFlags();
        if (!flagsOk) {
          this.emit('error', new Error(`Incomplete expect assertion for "expect.${commandName}()". Please consult the docs at https://nightwatchjs.org/api/expect/`));

          return this;
        }

        if ((args[0] instanceof Promise) && args[0]['@nightwatch_element']) {
          const elementArgs = args[0]['@nightwatch_args'];
          let selector = '';
          if (elementArgs[0] && elementArgs[0].value) {
            selector = elementArgs[0].value;
          }
          args[0].then(result => {
            args[0] = result;
            if (!result) {
              const err = new Error(`Unable to find element <${selector}>.`);
              err.isExpect = true;
              this.emit('error', err);

              return this;
            }

            this.run(...args);
          });
        } else {
          this.run(...args);
        }

        this.promise.catch(err => {
          if (!(this.instance instanceof chai.Assertion)) {
            this.emit('error', new Error(this.promiseRejectedMsg || `An error occurred while running .expect.${commandName}`));
          }
        });

        return this;
      };
    }

    return this;
  }

  define(parent = null) {
    const {commandName, nightwatchInstance, commandFn, commandQueue} = this;
    const namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(commandName, namespace, function queuedCommandFn(...args) {
      const stackTrace = Utils.getOriginalStackTrace(queuedCommandFn);
      const expectCommand = ExpectLoader.createInstance(nightwatchInstance, this.module, {
        args,
        commandName
      });

      const isAsyncCommand = this.isES6Async;
      const isES6Async = Utils.isUndefined(this.isES6Async) ? (nightwatchInstance.isES6AsyncTestcase || nightwatchInstance.settings.always_async_commands) : isAsyncCommand;

      const {deferred} = expectCommand;
      this.loadAssertions(expectCommand);

      const node = commandQueue.add({
        commandName,
        namespace: 'expect',
        commandFn,
        deferred,
        context: expectCommand,
        isAsyncCommand,
        isES6Async,
        args,
        stackTrace
      });

      if (isES6Async && (expectCommand.instance instanceof Promise)) {
        // prevent unhandledRejection errors
        expectCommand.instance.catch(err => {
          deferred.reject(err);
        });
      }
      
      return expectCommand.instance;
    }.bind(this));
  }

  loadAssertions(expectCommand) {
    const {nightwatchInstance, commandName} = this;

    // expect commands like .element() and .elements() have individual assertions (e.g. visible, present... / count);
    // however expect commands like .url(), .title(), and .cookie only have an implicit assertion which is based on their value
    if (expectCommand.hasAssertions) {
      const assertionsPath = path.join(__dirname, '../expect/assertions', expectCommand.assertionsPath || commandName);

      let modules = fs.readdirSync(assertionsPath);

      modules = modules.filter(moduleName => {
        return !moduleName.startsWith('_');
      });

      modules.forEach(assertionFileName => {
        const loader = new ExpectAssertionLoader(nightwatchInstance);
        loader
          .loadModule(assertionsPath, assertionFileName)
          .loadAssertion(commandName);
      });
    }
  }

}

module.exports = ExpectLoader;
