const BaseCommandLoader = require('./_base-loader.js');

class ChromeCommandLoader extends BaseCommandLoader {
  static get chromeCommands() {
    return [
      'launchApp',
      'getNetworkConditions',
      'setNetworkConditions',
      'sendDevToolsCommand',
      'sendAndGetDevToolsCommand',
      'setPermission',
      'setDownloadPath',
      'getCastSinks',
      'setCastSinkToUse',
      'startCastTabMirroring',
      'getCastIssueMessage',
      'stopCasting',
    ];
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);
  }

  loadCommands() {
    const commands = ChromeCommandLoader.chromeCommands;

    commands.forEach(propertyName => {
      this.nightwatchInstance.setApiMethod(propertyName, 'chrome', (function(commandName) {
        return this.createCommand(commandName);
      }.bind(this))(propertyName));
    });

    return this;
  }
}

module.exports = ChromeCommandLoader;
