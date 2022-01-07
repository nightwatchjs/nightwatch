const BaseLoader = require('./_base-loader.js');

class FirefoxCommandLoader extends BaseLoader {
  static get firefoxCommands() {
    return [
      'getContext',
      'setContext',
      'installAddon',
      'uninstallAddon'
    ];
  }

  loadCommands() {
    const commands = FirefoxCommandLoader.firefoxCommands;

    this.loadDriverCommands({
      commands,
      namespace: 'firefox'
    });

    return this;
  }
}

module.exports = FirefoxCommandLoader;
