const fs = require('fs');
const path = require('path');
const Utils = require('../../utils');

const __plugins = {};

module.exports = class PluginLoader {

  static get plugins() {
    return __plugins;
  }


  static load(pluginName) {
    try {

      if (PluginLoader.plugins[pluginName]) {
        return PluginLoader.plugins[pluginName];
      }

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
        // load custom commands, if any
        const commandsFolder = path.join(dirName, 'nightwatch', 'commands');
        try {
          const hasCommands = fs.lstatSync(commandsFolder).isDirectory();
          if (hasCommands) {
            plugin.commands = commandsFolder;
          }
        } catch (err) {
          plugin.commands = false;
        }

        // load custom assertions, if any
        const assertionsFolder = path.join(dirName, 'nightwatch', 'assertions');
        try {
          const hasAssertions = fs.lstatSync(assertionsFolder).isDirectory();
          if (hasAssertions) {
            plugin.assertions = assertionsFolder;
          }
        } catch (err) {
          plugin.assertions = false;
        }

        // load plugin globals, if defined
        const globalsPath = path.join(dirName, 'nightwatch', 'globals.js');
        plugin.globals = fs.existsSync(globalsPath) ? Utils.requireModule(globalsPath) : false;

        // load plugin transforms, if defined
        const transformsPath = path.join(dirName, 'nightwatch', 'transforms.js');
        plugin.transforms = fs.existsSync(transformsPath) ? Utils.requireModule(transformsPath) : null;
      }

      PluginLoader.plugins[pluginName] = plugin;

      return PluginLoader.plugins[pluginName];
    } catch (err) {
      const msg = err.message.split('\n')[0];
      const error = new Error(`Unable to load plugin: ${pluginName}: [${err.code}] ${msg}`);
      error.showTrace = true;
      error.displayed = false;

      throw error;
    }
  }

};
