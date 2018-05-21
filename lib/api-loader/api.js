const fs = require('fs');
const path = require('path');
const util = require('util');
const assertModule = require('assert');
const EventEmitter = require('events');
const NightwatchAssertion = require('../core/assertion.js');
const AssertionLoader = require('./assertion.js');
const CommandLoader = require('./command.js');
const ElementCommandLoader = require('./element-command.js');
const PageObjectLoader = require('./page-object.js');
const ExpectAssertionLoader = require('./expect-assertion.js');
const ExpectElementLoader = require('./expect-element.js');
const isObject = require('../util/utils.js').isObject;

class ApiLoader {

  static get assertOperators() {
    return {
      ok : ['ok', 'ko'],
      equal : ['==', '!='],
      notEqual : ['!=', '=='],
      deepEqual : ['deepEqual', 'not deepEqual'],
      notDeepEqual : ['not deepEqual', 'deepEqual'],
      strictEqual : ['===', '!=='],
      notStrictEqual : ['!==', '==='],
      throws : ['throws', 'doesNotThrow'],
      doesNotThrow : ['doesNotThrow', 'throws'],
      fail : 'fail',
      ifError : 'ifError'
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

  static get ExpectDefinitionsPath() {
    return path.join(__dirname, '../api/expect/');
  }

  static get ElementCommandFiles() {
    return path.join(__dirname, '../api/element-commands.js');
  }

  static get ElementCommandsPath() {
    return path.join(__dirname, '../api/element-commands/');
  }

  static get AssertionsBasePath() {
    return path.join(__dirname, '../api/assertions/');
  }

  static get CommandsFiles() {
    return [
      '../api/client-commands.js',
      '../api/client-commands/'
    ];
  }

  static get ProtocolActionsPath() {
    return path.join(__dirname, '../api/protocol.js');
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
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
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

    let commandFiles = fs.readdirSync(sourcePath);

    commandFiles.forEach(file => {
      let loader = new CommandLoader(this.nightwatchInstance);

      if (!isUserDefined) {
        loader.ignoreUnderscoreLeadingNames = true;
      }

      loader.loadModule(sourcePath, file).createWrapper().define(parent);
    });
  }

  loadProtocolActions() {
    let entries = Object.keys(ApiLoader.protocolActions);

    entries.forEach(commandName => {
      this.addCommandDefinition(commandName, ApiLoader.protocolActions[commandName]);
    });

    return this;
  }

  loadClientCommands(parent = null, sourcePath = ApiLoader.CommandsFiles) {
    if (Array.isArray(sourcePath)) {
      sourcePath.forEach(item => {
        this.loadClientCommands(parent, item);
      });
      return this;
    }

    if (CommandLoader.isFileNameValid(sourcePath)) {
      let commandDefinitions = require(path.join(__dirname, sourcePath))(this.nightwatchInstance);
      let entries = Object.keys(commandDefinitions);

      entries.forEach(commandName => {
        this.addCommandDefinition(commandName, commandDefinitions[commandName], parent);
      });
    } else {
      this.loadCommandsFromFolder(parent, path.join(__dirname, sourcePath));
    }

    return this;
  }

  loadElementCommands(parent = null) {
    this.loadCommandsFromFolder(parent, ApiLoader.ElementCommandsPath);

    let commandDefinitions = require(ApiLoader.ElementCommandFiles)(this.nightwatchInstance);
    let entries = Object.keys(commandDefinitions);

    entries.forEach(commandName => {
      let extraArgsCount = commandDefinitions[commandName];
      let loader = new ElementCommandLoader(this.nightwatchInstance, ApiLoader.protocolActions);

      loader.commandName = commandName;
      loader.createWrapper(extraArgsCount).define(parent);
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
   * @param prop
   * @param abortOnFailure
   * @returns {Function}
   */
  createStaticAssertion(prop, abortOnFailure) {
    class StaticAssert extends EventEmitter {
      constructor(args) {
        super();

        this.args = args;
        this.passed = null;
        this.expected = null;
        this.actual = null;
        let lastArgument = args[args.length-1];
        let isLastArgString = typeof lastArgument === 'string';
        this.message = isLastArgString && (args.length > 2 || typeof args[0] === 'boolean') && lastArgument
          || (typeof args[0] === 'function' && '[Function]');
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
          if (isObject(argument)) {
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
      assertion.assert(prop);

      this.commandQueue.add(prop, () => {
        return NightwatchAssertion.create(assertion.passed, {
          actual: assertion.actual,
          expected: assertion.expected
        }, assertFn, assertion.message, abortOnFailure, assertion.stackTrace).run(this.reporter, assertion);
      }, this.api, [], assertFn.stackTrace);

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
        this.loadAssertions(parent, item);
      });
      return;
    }

    if (this.nightwatchInstance.startSessionEnabled) {
      const commandFiles = fs.readdirSync(folder);

      Object.keys(ApiLoader.assertNamespaces).forEach(namespace => {
        for (let i = 0, len = commandFiles.length; i < len; i++) {
          let loader = new AssertionLoader(this.nightwatchInstance);

          if (!isUserDefined) {
            loader.ignoreUnderscoreLeadingNames = true;
          }

          loader.loadModule(folder, commandFiles[i])
            .setNamespace(namespace)
            .createWrapper(ApiLoader.assertNamespaces[namespace].abortOnFailure)
            .define(parent);
        }
      });
    }

    return this;
  }

  loadCustomAssertions(parent = null) {
    let assertionsPath = ApiLoader.adaptCustomPath(this.nightwatchInstance.options.custom_assertions_path);

    if (assertionsPath.length) {
      this.loadAssertions(parent, assertionsPath, true);
    }

    return this;
  }

  loadStaticExpect(parent = null) {
    try {
      let chaiExpect = module.require('chai').expect;
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

    ExpectElementLoader.define(this.nightwatchInstance, parent);

    let commandFiles = fs.readdirSync(ApiLoader.ExpectDefinitionsPath);
    commandFiles.forEach(commandFile => {
      let loader = new ExpectAssertionLoader(this.nightwatchInstance);
      loader.ignoreUnderscoreLeadingNames = true;
      loader.loadModule(ApiLoader.ExpectDefinitionsPath, commandFile).loadAssertion();
    });

    return this;
  }

  loadPageObjectsFromFolder(sourcePath = null, namespace = null) {
    let pageFiles = fs.readdirSync(sourcePath);
    pageFiles.forEach(file => {
      if (fs.lstatSync(path.join(sourcePath, file)).isDirectory()) {
        let pathFolder = path.join(sourcePath, file);
        this.loadPageObjectsFromFolder(pathFolder, file);

        return;
      }

      let loader = new PageObjectLoader(this.nightwatchInstance);
      if (namespace) {
        loader.setNamespace(namespace);
      }

      loader.loadModule(sourcePath, file).define();
    });
  }

  loadPageObjects() {
    let pageObjectsPath = ApiLoader.adaptCustomPath(this.nightwatchInstance.options.page_objects_path);

    pageObjectsPath.forEach(item => {
      this.loadPageObjectsFromFolder(item);
    });

    return this;
  }

  static init(nightwatchInstance) {
    ApiLoader.protocolActions = require(ApiLoader.ProtocolActionsPath)(nightwatchInstance);

    let api = new ApiLoader(nightwatchInstance);

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
