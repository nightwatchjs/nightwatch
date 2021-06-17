const BaseLoader = require('./_base-loader.js');

class ChromeCommandLoader extends BaseLoader {
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
      'stopCasting'
    ];
  }

  loadCommands() {
    const commands = ChromeCommandLoader.chromeCommands;

    this.loadDriverCommands({
      commands,
      namespace: 'chrome'
    });

    return this;
  }
}

module.exports = ChromeCommandLoader;
