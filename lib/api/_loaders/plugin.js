const fs = require('fs');
const path = require('path');
const Utils = require('../../utils');

module.exports = class PluginLoader {
  get api() {
    return this.nightwatchInstance.api;
  }

  get commandQueue() {
    return this.nightwatchInstance.queue;
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  load(pluginName) {
    try {
      const plugin = {};
      const pluginPath = Utils.getPluginPath(pluginName);
      const dirName = path.dirname(pluginPath);

      plugin.instance = require(pluginPath);

      let isFolder;
      try {
        isFolder = fs.lstatSync(path.join(dirName, 'nightwatch')).isDirectory();
      } catch (e) {
        plugin.hasFolder = false;
      }

      if (isFolder) {
        const commandsFolder = path.join(dirName, 'nightwatch', 'commands');
        const assertionsFolder = path.join(dirName, 'nightwatch', 'assertions');

        try {
          const hasCommands = fs.lstatSync(commandsFolder).isDirectory();
          if (hasCommands) {
            plugin.commands = commandsFolder;
          }
        } catch (err) {
          plugin.commands = false;
        }

        try {
          const hasAssertions = fs.lstatSync(assertionsFolder).isDirectory();
          if (hasAssertions) {
            plugin.assertions = assertionsFolder;
          }
        } catch (err) {
          plugin.assertions = false;
        }
      }

      return plugin;
    } catch (err) {
      const msg = err.message.split('\n')[0];
      const error = new Error(`Unable to load plugin: ${pluginName}: [${err.code}] ${msg}`);
      error.showTrace = true;
      error.displayed = false;

      throw error;
    }
  }

};
