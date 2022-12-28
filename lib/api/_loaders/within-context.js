const lodashMerge = require('lodash.merge');
const BaseLoader = require('./_base-loader.js');
const CommandWrapper = require('../../page-object/command-wrapper.js');
const Element = require('../../element');

let __commands_cache = {
  __commands_cache: true
};

class WithinLoader extends BaseLoader {
  get loadSubDirectories() {
    return false;
  }

  static loadCommandCache(nightwatchInstance) {
    if (!__commands_cache.loaded) {
      const ApiLoader = require('../index.js');
      const apiLoader = new ApiLoader(nightwatchInstance);

      return new Promise(resolve => {
        __commands_cache.loaded = true;

        if (nightwatchInstance.startSessionEnabled) {
          return apiLoader
            .loadCustomCommands(__commands_cache)
            .then(() => apiLoader.initPluginTransforms())
            .then(() => apiLoader.loadPlugins(__commands_cache))
            .then(() => resolve());
        }

        resolve();
      });

    }

    return Promise.resolve();
  }

  loadApi(context) {
    const ApiLoader = require('../index.js');

    Object.keys(__commands_cache).forEach((command) => {
      context[command] = ((commandName) => {
        return (...args) => {
          return this.nightwatchInstance.api[commandName](...args);
        };
      })(command);
    });

    const elementCommands = ApiLoader.getElementsCommandsStrict();

    if (elementCommands.length > 0) {
      elementCommands.forEach(command => {
        context[command] = ((commandName) => {
          return (...args) => {
            return this.nightwatchInstance.api[commandName](...args);
          };
        })(command);
      });
    }

    return context;
  }

  createWrapper() {
    return this;
  }

  withinDefinition(...args) {
    if (args.length !== 1) {
      throw new Error('within() expects exactly one argument.');
    }

    this.__instance = new WithinContext(this.loadApi.bind(this), this.nightwatchInstance, args[0]);

    return this.instance;
  }

  define() {
    this.nightwatchInstance.setApiMethod('within', this.withinDefinition.bind(this));
  }
}

class WithinContext {

  get api() {
    return this.__api;
  }

  get client() {
    return this.__client;
  }

  get args() {
    return this.__args;
  }

  constructor(loadApi, nightwatchInstance, container) {
    this.commandLoader = loadApi;
    this.__client = nightwatchInstance;
    this.__api = Object.assign({}, nightwatchInstance.api);
    this.__element = Element.createFromSelector(container);
    this.__needsRecursion = true;

    this.__promise = CommandWrapper.addWrappedCommandsAsync(this, this.commandLoader);
  }
}

module.exports = WithinLoader;
