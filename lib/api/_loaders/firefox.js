const BaseCommandLoader = require('./_base-loader.js');

class FirefoxCommandLoader {
  static get firefoxCommands() {
    return [
      'getContext',
      'setContext',
      'installAddon',
      'uninstallAddon'
    ];
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get commandQueue() {
    return this.nightwatchInstance.queue;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  /**
   * @param commandName
   * @returns {Function}
   */
  createCommand(commandName) {
    const {transport} = this;

    return BaseCommandLoader.createQueuedCommandFn({
      commandName,
      commandFn() {
        return function commandFn({args}) {
          return transport.driver[commandName](...args).catch((error) => {
            if (error.remoteStacktrace) {
              delete error.remoteStacktrace;
            }

            return {
              value: null,
              error
            };
          });
        };
      },
      context: this,
      namespace: 'firefox'
    });
  }

  loadCommands() {
    const commands = FirefoxCommandLoader.firefoxCommands;

    commands.forEach(propertyName => {
      this.nightwatchInstance.setApiMethod(propertyName, 'firefox', (function(commandName) {
        return this.createCommand(commandName);
      }.bind(this))(propertyName));
    });

    return this;
  }
}

module.exports = FirefoxCommandLoader;
