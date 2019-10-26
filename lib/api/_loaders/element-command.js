const CommandLoader = require('./command.js');
const ElementCommand = require('../../element').Command;

class ElementCommandLoader extends CommandLoader {
  static createInstance(CommandModule, opts) {
    let ClassName = CommandModule || ElementCommand;

    return new ClassName(opts);
  }

  createWrapper() {
    if (this.module) {
      this.commandFn = function commandFn({args, stackTrace}) {
        const instance = ElementCommandLoader.createInstance(this.module, {
          args,
          commandName: this.commandName,
          nightwatchInstance: this.nightwatchInstance
        });

        instance.stackTrace = stackTrace;

        return instance.command();
      };
    }

    return this;
  }
}

module.exports = ElementCommandLoader;
