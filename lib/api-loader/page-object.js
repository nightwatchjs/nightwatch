const CommandQueue = require('../core/queue.js');
const BaseCommandLoader = require('./_base-loader.js');

class PageObjectLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

  }

  createWrapper() {
    if (this.module) {
      let moduleDefinition = this.module;
      let command = this;

      this.commandFn = function commandFn(...args) {
        command.createPageObject(moduleDefinition);

        return command.executeCommand(...args);
      };
    }
  }

  define() {
    let commandName = 'element';
    let self = this;
    let command = this.commandFn;

    this.nightwatchInstance.setApiMethod(commandName, 'expect', function commandFn(...args) {
      let originalStackTrace = ExpectElementLoader.getOriginalStrackTrace(commandFn);

      CommandQueue.add(commandName, command, self, [], originalStackTrace);

      return this;
    }.bind(this.api));
  }
}

module.exports = PageObjectLoader;