const path = require('path');
const fs = require('fs');
const Utils = require('../utils');
const StaticApis = require('./_loaders/static.js');
const CommandLoader = require('./_loaders/command.js');
const ElementCommandLoader = require('./_loaders/element-command.js');
const AssertionLoader = require('./_loaders/assertion.js');
const ExpectLoader = require('./_loaders/expect.js');
const PageObjectLoader = require('./_loaders/page-object.js');
const WithinContextLoader = require('./_loaders/within-context.js');
const PluginLoader = require('./_loaders/plugin.js');

const __elementCommandsStrict = [];
const __elementCommands = [];
const DEFAULT_PLUGINS = ['nightwatch-axe-verbose'];

class ApiLoader {
  static isElementCommand(commandName) {
    return __elementCommands.includes(commandName);
  }

  static get CommandFiles() {
    return {
      protocolActions: {
        dirPath: 'protocol',
        protocol: true
      },
      clientCommands: 'client-commands',

      elementCommands: {
        dirPath: 'element-commands',
        element: true,
        loader: ElementCommandLoader
      },

      assertions: {
        loader: AssertionLoader,
        dirPath: 'assertions',
        element: true,
        namespaces: {
          assert: {
            abortOnFailure: true
          },
          verify: {
            abortOnFailure: false
          }
        }
      },

      expect: {
        loader: ExpectLoader,
        dirPath: 'expect',
        element: true,
        namespaces: {
          expect: {
            abortOnFailure: true
          },
          should: {
            abortOnFailure: false
          }
        }
      }
    };
  }

  /**
   * @param {*} customPath
   * @return {Array}
   */
  static adaptCustomPath(customPath) {
    return customPath.map(location => {
      return path.resolve(location);
    });
  }

  static getElementsCommandsStrict() {
    return __elementCommandsStrict;
  }

  static init(nightwatchInstance) {
    const api = new ApiLoader(nightwatchInstance);
    const staticApis = new StaticApis(nightwatchInstance);
    staticApis.loadStaticAssertions();
    staticApis.loadStaticExpect();

    api.loadApiCommandsSync();

    return WithinContextLoader.loadCommandCache(nightwatchInstance)
      .then(_ => api.loadCustomCommands())
      .then(_ => api.loadCustomAssertions())
      .then(_ => api.initPluginTransforms())
      .then(_ => api.loadPlugins())
      .then(_ => api.defineWithinContext())
      .then(_ => api.loadPageObjects())
      .then(_ => {
        if (!nightwatchInstance.unitTestingMode) {
          const EnsureApi = require('./_loaders/ensure.js');
          const ensureApi = new EnsureApi(nightwatchInstance);
          ensureApi.loadAssertions();

          const ChromeApi = require('./_loaders/chrome.js');
          const chromeApis = new ChromeApi(nightwatchInstance);
          chromeApis.loadCommands();

          const FirefoxApi = require('./_loaders/firefox.js');
          const firefoxApis = new FirefoxApi(nightwatchInstance);
          firefoxApis.loadCommands();
        }
      });
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get commandQueue() {
    return this.nightwatchInstance.queue;
  }

  static makeAssertProxy(api) {
    return new Proxy(api, {
      get(target, name) {
        if (name === 'not') {
          return new Proxy(api, {
            get(target, name) {
              return function (...args) {
                if (!Utils.isFunction(target[name])) {
                  throw new Error(`Unknown api method .not."${name}".`);
                }

                return target[name]({negate: true, args});
              };
            }
          });
        }

        return function (...args) {
          if (typeof name != 'string') {
            return null;
          }
          if (!Utils.isFunction(target[name])) {
            throw new Error(`Unknown api method "${name}".`);
          }

          return target[name]({negate: false, args});
        };
      }
    });
  }


  initPluginTransforms() {
    this.nightwatchInstance.transforms = Promise.resolve([]);

    return Promise.resolve();
  }

  loadPlugins(parent = null) {
    let plugins = DEFAULT_PLUGINS.concat(this.nightwatchInstance.options.plugins || []);
    plugins = [... new Set(plugins)];

    const promises = [];
    plugins.forEach(pluginName => {
      const plugin = PluginLoader.load(pluginName);

      if (plugin.commands) {
        promises.push(this.__loadCustomObjects({
          parent,
          sourcePath: plugin.commands,
          isUserDefined: true
        }));
      }

      if (plugin.assertions) {
        promises.push(this.__loadCustomObjects({
          parent,
          sourcePath: plugin.assertions,
          namespaces: ApiLoader.CommandFiles.assertions.namespaces,
          Loader: AssertionLoader
        }));
      }

      if (plugin.transforms) {
        promises.push(Promise.resolve(this.__loadPluginTransforms(plugin.transforms)));
      }
    });

    return Promise.all(promises);
  }


  async defineWithinContext(parent) {
    const loader = new WithinContextLoader(this.nightwatchInstance);
    loader.define(parent);

    return Promise.resolve();
  }

  /**
   * Loads the page objects, if defined
   * @param parent
   */
  async loadPageObjects(parent = null) {
    await PageObjectLoader.loadApiCommands(this.nightwatchInstance);

    return this.__loadCustomObjects({
      parent,
      sourcePath: this.nightwatchInstance.options.page_objects_path,
      isUserDefined: true,
      Loader: PageObjectLoader
    });
  }

  /**
   * Loads custom assertions, if defined
   *
   * @param parent
   */
  loadCustomAssertions(parent = null) {
    return this.__loadCustomObjects({
      parent,
      sourcePath: this.nightwatchInstance.options.custom_assertions_path,
      namespaces: ApiLoader.CommandFiles.assertions.namespaces,
      Loader: AssertionLoader
    });
  }

  /**
   * Loads custom commands, if defined
   * @param parent
   */
  loadCustomCommands(parent = null) {
    return this.__loadCustomObjects({
      parent,
      sourcePath: this.nightwatchInstance.options.custom_commands_path,
      isUserDefined: true
    });
  }

  /**
   * Loads built-in api commands, assertions, and expect definitions
   * @param parent
   * @param {object} options
   */
  loadApiCommandsSync(parent = null, {loadAssertions = true, loadClientCommands = true} = {}) {
    Object.keys(ApiLoader.CommandFiles)
      .forEach((key) => {
        const commands = ApiLoader.CommandFiles[key];
        const {namespaces} = commands;

        if (!loadAssertions && key === 'assertions') {
          return;
        }

        if (!loadClientCommands && key === 'clientCommands') {
          return;
        }

        let elementCommandStrict = false;
        if (key === 'elementCommands') {
          elementCommandStrict = true;
        }

        let dirPath;
        let Loader = CommandLoader;
        let isProtocolCommand = false;
        let isElementCommand = false;

        if (Utils.isString(commands)) {
          dirPath = path.join(__dirname, commands);
        } else {
          dirPath = path.join(__dirname, commands.dirPath);
          isProtocolCommand = commands.protocol;
          isElementCommand = commands.element;

          if (commands.loader) {
            Loader = commands.loader;
          }
        }

        const opts = {
          dirPath,
          parent,
          Loader,
          isProtocolCommand,
          isElementCommand,
          elementCommandStrict,
          namespacesObj: namespaces
        };

        // protocol commands are not loaded onto the main page object
        if (parent && isProtocolCommand) {
          return;
        }

        this.__loadCommandsSync(opts);
      });
  }

  addCommandDefinitionSync({
    dirPath,
    isUserDefined = false,
    fileName,
    parent,
    namespace = [],
    abortOnFailure = false,
    isProtocolCommand = false,
    isElementCommand = false,
    elementCommandStrict = false,
    Loader = CommandLoader
  }) {
    const loader = new Loader(this.nightwatchInstance);
    loader.isUserDefined = isUserDefined;

    if (namespace && namespace.length) {
      loader.setNamespace(namespace);
    }

    loader
      .loadModule(dirPath, fileName)
      .createWrapper(abortOnFailure)
      .define(parent);

    if (isElementCommand && loader.commandName && !__elementCommands.includes(loader.commandName)) {
      __elementCommands.push(loader.commandName);
    }

    if (elementCommandStrict && loader.commandName && !__elementCommandsStrict.includes(loader.commandName)) {
      __elementCommandsStrict.push(loader.commandName);
    }
  }

  async addCommandDefinitionAsync({
    dirPath,
    isUserDefined = false,
    fileName,
    parent,
    namespace = [],
    abortOnFailure = false,
    isElementCommand = false,
    Loader = CommandLoader
  }) {
    const loader = new Loader(this.nightwatchInstance);
    loader.isUserDefined = isUserDefined;

    if (namespace && namespace.length) {
      loader.setNamespace(namespace);
    }

    await loader.loadModuleAsync(dirPath, fileName);
    loader.createWrapper(abortOnFailure).define(parent);

    if (isElementCommand && loader.commandName && !__elementCommands.includes(loader.commandName)) {
      __elementCommands.push(loader.commandName);
    }
  }

  __loadCustomObjects({parent = null, Loader = CommandLoader, namespaces, sourcePath}) {
    if (!sourcePath) {
      sourcePath = [];
    }

    if (!Array.isArray(sourcePath)) {
      sourcePath = [sourcePath];
    }

    const dirPathArr = ApiLoader.adaptCustomPath(sourcePath);
    const commandFiles = [];

    dirPathArr.forEach((dirPath, index) => this.__loadCommandsSync({
      parent,
      dirPath,
      originalSourcePath: sourcePath[index],
      isUserDefined: true,
      namespacesObj: namespaces,
      Loader,
      loadAction(opts) {
        commandFiles.push(opts);
      }
    }));

    const hasCorrespondingJsFile = (parsedResource) => {
      const jsFile = path.join(parsedResource.dir, `${parsedResource.name}${Utils.jsFileExt}`);

      const entry = commandFiles.find(({dirPath, fileName}) => {
        return path.join(dirPath, fileName) === jsFile;
      });

      return !!entry;
    };

    const commandFilesProcessed = commandFiles.reduce((prev, opts) => {
      const {dirPath, fileName} = opts;
      const fullPath = path.join(dirPath, fileName);
      const parsedResource = path.parse(fullPath);
      const isTypeScriptFile = parsedResource.ext === Utils.tsFileExt;

      // ignore `.ts` files if a `.js` has already been loaded
      if (isTypeScriptFile && hasCorrespondingJsFile(parsedResource)) {
        return prev;
      }

      prev.push(opts);

      return prev;
    }, []);

    return Promise.all(commandFilesProcessed.map(opts => this.addCommandDefinitionAsync(opts)));
    //commandFilesProcessed.forEach(opts => this.addCommandDefinitionSync(opts));
  }

  __loadCommandsSync({
    parent = null,
    namespacesObj = null,
    ns = null,
    dirPath,
    originalSourcePath,
    abortOnFailure = false,
    isProtocolCommand = false,
    isElementCommand = false,
    isUserDefined = false,
    elementCommandStrict = false,
    Loader = CommandLoader,
    loadAction = this.addCommandDefinitionSync.bind(this)
  }) {
    if (namespacesObj) {
      Object.keys(namespacesObj).forEach((ns) => this.__loadCommandsSync({
        ns,
        parent,
        dirPath,
        isUserDefined,
        isElementCommand,
        elementCommandStrict,
        Loader,
        loadAction: isUserDefined ? loadAction : this.addCommandDefinitionSync.bind(this),
        abortOnFailure: namespacesObj[ns].abortOnFailure
      }));
    } else {
      Utils.readFolderRecursively(dirPath, [], (dirPath, fileName, namespace) => {
        loadAction.call(this, {
          dirPath,
          fileName,
          parent,
          isUserDefined,
          namespace: ns || namespace,
          isProtocolCommand,
          isElementCommand,
          elementCommandStrict,
          Loader,
          abortOnFailure
        });
      }, function readDirFn(sourcePath) {
        try {
          return {
            resources: fs.readdirSync(sourcePath),
            sourcePath
          };
        } catch (err) {
          if (err.code === 'ENOENT' && originalSourcePath && originalSourcePath.startsWith('examples/')) {
            return readDirFn(path.join('node_modules/nightwatch/', originalSourcePath));
          }

          throw err;
        }

      });
    }
  }

  __loadCommands({
    parent = null,
    namespacesObj = null,
    ns = null,
    dirPath,
    abortOnFailure = false,
    isProtocolCommand = false,
    isElementCommand = false,
    isUserDefined = false,
    Loader = CommandLoader,
    loadAction = this.addCommandDefinitionAsync.bind(this)
  }) {
    if (namespacesObj) {
      return Promise.all(Object.keys(namespacesObj).map((ns) => {
        return this.__loadCommands({
          ns,
          parent,
          dirPath,
          isUserDefined,
          isElementCommand,
          Loader,
          abortOnFailure: namespacesObj[ns].abortOnFailure
        });
      }));
    }

    const promises = [];

    Utils.readFolderRecursively(dirPath, [], (dirPath, fileName, namespace) => {
      const result = Promise.resolve(loadAction.call(this, {
        dirPath,
        fileName,
        parent,
        isUserDefined,
        namespace: ns || namespace,
        isProtocolCommand,
        isElementCommand,
        Loader,
        abortOnFailure
      }));

      promises.push(result);

    }, function readDirFn(sourcePath) {
      return {
        resources: fs.readdirSync(sourcePath),
        sourcePath
      };
    });

    return Promise.all(promises);
  }

  /**
   * @param {function|Array} transforms
   * @returns {Promise}
   */
  __normalizeTransforms(transforms) {
    if (typeof transforms === 'function') {
      return transforms();
    }

    return Promise.resolve(transforms || []);
  }

  /**
   * @param {function|Array} nextTransforms
   */
  __loadPluginTransforms(nextTransforms) {
    this.nightwatchInstance.transforms = this.nightwatchInstance.transforms.then(existingTransforms =>
      this.__normalizeTransforms(nextTransforms).then(items => existingTransforms.concat(items)));
  }
}

module.exports = ApiLoader;
