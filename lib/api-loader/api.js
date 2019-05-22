const fs = require('fs');
const path = require('path');
const util = require('util');
const assertModule = require('assert');
const EventEmitter = require('events');

const NightwatchAssertion = require('../core/assertion.js');
const AssertionLoader = require('./assertion-loader.js');
const CommandLoader = require('./command.js');
const ElementCommandLoader = require('./element-command.js');
const PageObjectLoader = require('./page-object.js');
const ExpectAssertionLoader = require('./expect-assertion.js');
const ProtocolActions = require('../api/protocol.js');
const Utils = require('../util/utils.js');

class ApiLoader {

  static get assertOperators() {
    return {
      ok: ['ok', 'ko'],
      equal: ['==', '!='],
      notEqual: ['!=', '=='],
      deepEqual: ['deepEqual', 'not deepEqual'],
      notDeepEqual: ['not deepEqual', 'deepEqual'],
      strictEqual: ['===', '!=='],
      notStrictEqual: ['!==', '==='],
      throws: ['throws', 'doesNotThrow'],
      doesNotThrow: ['doesNotThrow', 'throws'],
      fail: 'fail',
      ifError: 'ifError'
    };
  }

  static get assertNamespaces() {
    return {
      assert: {
        abortOnFailure: true
      },
      verify: {
        abortOnFailure: false
      }
    };
  }

  static get ExpectLoadersPath() {
    return path.join(__dirname, './expect/');
  }

  static get ExpectDefinitionsPath() {
    return path.join(__dirname, '../api/expect/');
  }

  static get ElementCommandsPath() {
    return path.join(__dirname, '../api/element-commands/');
  }

  static get AssertionsBasePath() {
    return path.join(__dirname, '../api/assertions/');
  }

  static get CommandsFiles() {
    return path.join(__dirname, '../api/client-commands/');
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

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.protocolInstance = new ProtocolActions(nightwatchInstance);
    this.protocolActions = this.protocolInstance.Actions;
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

  /////////////////////////////////////////////////////////////////////
  // Commands
  /////////////////////////////////////////////////////////////////////
  addCommandDefinition(commandName, commandFn, parent) {
    let loader = new CommandLoader(this.nightwatchInstance);
    loader.commandName = commandName;
    loader.commandFn = commandFn;
    loader.define(parent);
  }

  /**
   * @param {object} parent
   * @param sourcePath
   * @param {boolean} isUserDefined
   */
  loadCommandsFromFolder(parent = null, sourcePath, isUserDefined = false) {
    if (sourcePath && Array.isArray(sourcePath)) {
      sourcePath.forEach(item => {
        this.loadCommandsFromFolder(parent, item, isUserDefined);
      });

      return;
    }

    Utils.readFolderRecursively(sourcePath, [], (fullSourcePath, fileName, ns) => {
      const loader = new CommandLoader(this.nightwatchInstance);

      loader.isUserDefined = isUserDefined;
      if (ns.length) {
        loader.setNamespace(ns);
      }

      loader
        .loadModule(fullSourcePath, fileName)
        .createWrapper()
        .define(parent);
    });
  }

  loadProtocolActions(parent) {
    const entries = Object.keys(this.protocolActions);

    entries.forEach(commandName => {
      this.addCommandDefinition(commandName, this.protocolActions[commandName].bind(this.protocolInstance), parent);
    });

    return this;
  }

  loadClientCommands(parent = null, sourcePath = ApiLoader.CommandsFiles) {
    this.loadCommandsFromFolder(parent, sourcePath);

    return this;
  }

  loadElementCommands(parent = null) {
    // loads element commands from folder
    const commandFiles = fs.readdirSync(ApiLoader.ElementCommandsPath);

    commandFiles.forEach(file => {
      const loader = new ElementCommandLoader(this.nightwatchInstance);

      loader.isUserDefined = false;
      loader.loadModule(ApiLoader.ElementCommandsPath, file)
        .createWrapper()
        .define(parent);
    });

    return this;
  }

  loadCustomCommands(parent = null) {
    let commandsPath = ApiLoader.adaptCustomPath(this.nightwatchInstance.options.custom_commands_path);

    if (commandsPath.length) {
      this.loadCommandsFromFolder(parent, commandsPath, true);
    }

    return this;
  }

  /////////////////////////////////////////////////////////////////////
  // Assertions
  /////////////////////////////////////////////////////////////////////
  /**
   * Extends the node.js assert module
   *
   * @param commandName
   * @param abortOnFailure
   * @returns {Function}
   */
  createStaticAssertion(commandName, abortOnFailure) {
    class StaticAssert extends EventEmitter {
      constructor(args) {
        super();

        this.args = args;
        this.passed = null;
        this.expected = null;
        this.actual = null;
        let lastArgument = args[args.length - 1];
        let isLastArgString = Utils.isString(lastArgument);
        this.message = isLastArgString && (args.length > 2 || Utils.isBoolean(args[0])) && lastArgument ||
          Utils.isFunction(args[0]) && '[Function]';
      }

      getMessage(propName) {
        if (!Array.isArray(ApiLoader.assertOperators[propName])) {
          return ApiLoader.assertOperators[propName] || '';
        }

        let operator = this.passed ? ApiLoader.assertOperators[propName][0] : ApiLoader.assertOperators[propName][1];

        if (this.args.length === 2) {
          this.args.splice(1, 0, operator);
        } else {
          this.args.push(operator);
        }

        this.args = this.args.map(function(argument) {
          if (Utils.isObject(argument)) {
            argument = util.inspect(argument);
          }

          return argument;
        });

        return this.args.join(' ');
      }

      assert(propName) {
        try {
          assertModule[propName].apply(null, this.args);
          this.passed = true;
          this.message = `Passed [${propName}]: ${this.message || this.getMessage(propName)}`;
        } catch (ex) {
          this.passed = false;
          this.message = `Failed [${propName}]: (${ex.message || this.message || this.getMessage(propName)})`;
          this.actual = ex.actual;
          this.expected = ex.expected;
          this.stackTrace = ex.stack;
        }
      }
    }

    return function assertFn(...args) {
      let assertion = new StaticAssert(args);
      assertion.assert(commandName);

      const namespace = abortOnFailure ? 'assert' : 'verify';
      const commandFn = () => {
        return NightwatchAssertion.create(assertion.passed, {
          actual: assertion.actual,
          expected: assertion.expected
        }, assertFn, assertion.message, abortOnFailure, assertion.stackTrace).run(this.reporter, assertion);
      };

      this.commandQueue.add({
        commandName,
        commandFn,
        context: this.api,
        args: [],
        stackTrace: assertFn.stackTrace,
        namespace
      });

      return this.api;
    }.bind(this);
  }

  loadStaticAssertions(parent = null) {
    Object.keys(assertModule).forEach(prop => {
      let namespace;
      if (parent) {
        namespace = parent.assert = parent.assert || {};
      }

      this.nightwatchInstance.setApiMethod(prop, namespace || 'assert', (function(prop) {
        return this.createStaticAssertion(prop, true);
      }.bind(this))(prop));

      if (this.nightwatchInstance.startSessionEnabled) {
        let namespace;
        if (parent) {
          namespace = parent.verify = parent.verify || {};
        }

        this.nightwatchInstance.setApiMethod(prop, namespace || 'verify', (function(prop) {
          return this.createStaticAssertion(prop, false);
        }.bind(this))(prop));
      }
    });

    return this;
  }

  loadAssertions(parent = null, folder = ApiLoader.AssertionsBasePath, isUserDefined = false) {
    if (Array.isArray(folder)) {
      folder.forEach(item => {
        this.loadAssertions(parent, item, isUserDefined);
      });

      return;
    }

    if (this.nightwatchInstance.startSessionEnabled) {
      const assertFiles = fs.readdirSync(folder);

      Object.keys(ApiLoader.assertNamespaces).forEach(namespace => {
        assertFiles.forEach(assertionFile => {
          const loader = new AssertionLoader(this.nightwatchInstance);

          loader.isUserDefined = isUserDefined;
          loader.loadModule(folder, assertionFile)
            .setNamespace(namespace)
            .createWrapper(ApiLoader.assertNamespaces[namespace].abortOnFailure)
            .define(parent);
        });
      });
    }

    return this;
  }

  loadCustomAssertions(parent = null) {
    const assertionsPath = ApiLoader.adaptCustomPath(this.nightwatchInstance.options.custom_assertions_path);

    if (assertionsPath.length) {
      this.loadAssertions(parent, assertionsPath, true);
    }

    return this;
  }

  loadStaticExpect(parent = null) {
    try {
      const chaiExpect = module.require('chai').expect;
      this.nightwatchInstance.setApiMethod('expect', parent, function() {
        return chaiExpect.apply(chaiExpect, arguments);
      });
    } catch (err) {
      this.nightwatchInstance.setApiMethod('expect', parent, {});
    }

    return this;
  }

  loadExpectAssertions(parent = null) {
    const chai = require('chai-nightwatch');
    const ChaiAssertion = chai.Assertion;
    const flag = chai.flag;

    ChaiAssertion.addMethod('before', function(ms) {
      flag(this, 'waitFor', ms);
      flag(this, 'before', true);
    });

    ChaiAssertion.addMethod('after', function(ms) {
      flag(this, 'after', true);
      flag(this, 'waitFor', ms);
    });

    this.loadStaticExpect(parent);

    let expectLoaders = fs.readdirSync(ApiLoader.ExpectLoadersPath);
    expectLoaders = expectLoaders.filter(fileName => {
      return !fileName.startsWith('_') && Utils.isFileNameValid(fileName);
    });

    expectLoaders.forEach(fileName => {
      const ExpectLoader = require(path.join(ApiLoader.ExpectLoadersPath, fileName));
      ExpectLoader.define(this.nightwatchInstance, parent);

      if (ExpectLoader.hasAssertions) {
        const assertionsPath = path.join(ApiLoader.ExpectDefinitionsPath, ExpectLoader.commandName);
        const modules = fs.readdirSync(assertionsPath);
        modules.forEach(assertionFileName => {
          const loader = new ExpectAssertionLoader(this.nightwatchInstance);
          loader.ignoreUnderscoreLeadingNames = true;
          loader.loadModule(assertionsPath, assertionFileName).loadAssertion();
        });
      }
    });

    return this;
  }

  /////////////////////////////////////////////////////////////////////
  // Page Objects
  /////////////////////////////////////////////////////////////////////
  loadPageObjects() {
    const pageObjectsPath = ApiLoader.adaptCustomPath(this.nightwatchInstance.options.page_objects_path);
    pageObjectsPath.forEach(item => this.__loadPageObjectsFromFolder(item));

    return this;
  }

  __loadPageObjectsFromFolder(sourcePath = null) {
    const namespace = [];
    Utils.readFolderRecursively(sourcePath, namespace, (fullSourcePath, fileName, ns) => {
      const loader = new PageObjectLoader(this.nightwatchInstance);
      if (ns) {
        loader.setNamespace(ns);
      }

      loader.loadModule(fullSourcePath, fileName).define();
    });
  }

  static init(nightwatchInstance) {
    const api = new ApiLoader(nightwatchInstance);

    return api
      .loadProtocolActions()
      .loadClientCommands()
      .loadElementCommands()
      .loadCustomCommands()
      .loadStaticAssertions()
      .loadAssertions()
      .loadCustomAssertions()
      .loadExpectAssertions()
      .loadPageObjects();
  }
}

module.exports = ApiLoader;
