const path = require('path');
const Utils = require('../utils');
const StaticApis = require('./_loaders/static.js');
const CommandLoader = require('./_loaders/command.js');
const ElementCommandLoader = require('./_loaders/element-command.js');
const AssertionLoader = require('./_loaders/assertion.js');
const ExpectLoader = require('./_loaders/expect.js');
const PageObjectLoader = require('./_loaders/page-object.js');

class ApiLoader {
  static get CommandFiles() {
    return {
      protocolActions: 'protocol',
      clientCommands: 'client-commands',

      elementCommands: {
        dirPath: 'element-commands',
        loader: ElementCommandLoader
      },

      assertions: {
        loader: AssertionLoader,
        dirPath: 'assertions',
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
        namespaces: {
          expect: {
            abortOnFailure: true
          },
          should: {
            abortOnFailure: false
          }
        }
      }
    }
  }

  /**
   * @param {*} customPath
   * @return {Array}
   */
  static adaptCustomPath(customPath) {
    if (!customPath) {
      customPath = [];
    }

    if (!Array.isArray(customPath)) {
      customPath = [customPath];
    }

    return customPath.map(location => {
      return path.resolve(location);
    });
  }

  static init(nightwatchInstance) {
    const api = new ApiLoader(nightwatchInstance);
    const staticApis = new StaticApis(nightwatchInstance);

    staticApis.loadStaticAssertions();
    staticApis.loadStaticExpect();

    api.loadApiCommandsSync();
    api.loadCustomCommandsSync();
    api.loadCustomAssertionsSync();
    api.loadPageObjectsSync();
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
    return this.nightwatchInstance.session.commandQueue;
  }

  /**
   * Loads the page objects, if defined
   * @param parent
   */
  loadPageObjectsSync(parent = null) {
    this.__loadCustomObjectsSync({
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
  loadCustomAssertionsSync(parent = null) {
    const namespaces = Object.keys(ApiLoader.CommandFiles.assertions);

    this.__loadCustomObjectsSync({
      parent,
      sourcePath: this.nightwatchInstance.options.custom_assertions_path,
      namespaces,
      Loader: AssertionLoader
    });
  }

  /**
   * Loads custom commands, if defined
   * @param parent
   */
  loadCustomCommandsSync(parent = null) {
    this.__loadCustomObjectsSync({
      parent,
      sourcePath: this.nightwatchInstance.options.custom_commands_path,
      isUserDefined: true
    });
  }

  /**
   * Loads built-in api commands, assertions, and expect definitions
   * @param parent
   */
  loadApiCommandsSync(parent = null) {
    Object.keys(ApiLoader.CommandFiles)
      .forEach((key) => {
        const commands = ApiLoader.CommandFiles[key];
        const {namespaces} = commands;

        let dirPath;
        let Loader = CommandLoader;

        if (Utils.isString(commands)) {
          dirPath = path.join(__dirname, commands);
        } else {
          dirPath = path.join(__dirname, commands.dirPath);
          Loader = commands.loader;
        }

        const opts = {
          dirPath,
          parent,
          Loader,
          namespacesObj: namespaces
        };

        this.__loadCommandsSync(opts);
      });
  }

  addCommandDefinitionSync({
    dirPath,
    isUserDefined = false,
    fileName,
    parent,
    namespace = [],
    abortOnFailure,
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
  }

  __loadCustomObjectsSync({parent = null, Loader = CommandLoader, namespaces, sourcePath}) {
    const dirPathArr = ApiLoader.adaptCustomPath(sourcePath);

    dirPathArr.forEach(dirPath => this.__loadCommandsSync({
      parent,
      Loader,
      dirPath,
      isUserDefined: true,
      namespacesObj: namespaces
    }));
  }

  __loadCommandsSync({parent = null, namespacesObj = null, ns = null, dirPath, abortOnFailure = false, isUserDefined = false, Loader = CommandLoader}) {
    if (namespacesObj) {
      Object.keys(namespacesObj).forEach((ns) => this.__loadCommandsSync({
        ns,
        parent,
        dirPath,
        isUserDefined,
        Loader,
        abortOnFailure: namespacesObj[ns].abortOnFailure
      }));
    } else {
      Utils.readFolderRecursively(dirPath, [], (dirPath, fileName, namespace) => {
        this.addCommandDefinitionSync({
          dirPath,
          fileName,
          parent,
          isUserDefined,
          namespace: ns || namespace,
          Loader,
          abortOnFailure
        });
      });
    }
  }
}

module.exports = ApiLoader;
