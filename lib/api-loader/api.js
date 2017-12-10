const fs = require('fs');
const path = require('path');
const util = require('util');
const assertModule = require('assert');
const NightwatchAssertion = require('../core/assertion.js');
const AssertionLoader = require('./assertion.js');
const CommandLoader = require('./command.js');
const ElementCommandLoader = require('./element-command.js');
const PageObjectLoader = require('./page-object.js');
const ExpectAssertionLoader = require('./expect-assertion.js');
const ExpectElementLoader = require('./expect-element.js');

module.exports = new (function() {
  const AssertionsBasePath = path.join(__dirname, '../api/assertions/');
  const ElementCommandFiles = path.join(__dirname, '../api/element-commands.js');
  const ExpectDefinitionsPath = path.join(__dirname, '../api/expect/');

  const CommandsFiles = [
    '../api/protocol.js',
    '../api/element-commands/',
    '../api/client-commands.js',
    '../api/client-commands/'
  ];

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

    constructor(nightwatchInstance) {
      this.nightwatchInstance = nightwatchInstance;
    }

    /////////////////////////////////////////////////////////////////////
    // Commands
    /////////////////////////////////////////////////////////////////////
    addCommandDefinition(commandName, commandFn) {
      let loader = new CommandLoader(this.nightwatchInstance);
      loader.commandName = commandName;
      loader.commandFn = commandFn;
      loader.define();
    }

    /**
     * @param sourcePath
     * @param {boolean} isUserDefined
     */
    loadCommandsFolder(sourcePath, isUserDefined = false) {
      if (sourcePath && Array.isArray(sourcePath)) {
        sourcePath.forEach(item => {
          this.loadCommandsFolder(item, isUserDefined);
        });
        return;
      }

      let commandFiles = fs.readdirSync(sourcePath);

      for (let i = 0, len = commandFiles.length; i < len; i++) {
        let loader = new CommandLoader(this.nightwatchInstance);

        if (!isUserDefined) {
          loader.ignoreUnderscoreLeadingNames = true;
        }

        loader.loadModule(sourcePath, commandFiles[i]).createWrapper().define();
      }
    }

    loadCommands(sourcePath = CommandsFiles) {
      if (sourcePath && Array.isArray(sourcePath)) {
        sourcePath.forEach(item => {
          this.loadCommands(item);
        });
        return;
      }

      if (CommandLoader.isFileNameValid(sourcePath)) {
        let commandDefinitions = require(path.join(__dirname, sourcePath))(this.nightwatchInstance);
        let entries = Object.keys(commandDefinitions);
        entries.forEach(commandName => {
          this.addCommandDefinition(commandName, commandDefinitions[commandName]);
        });
      } else {
        this.loadCommandsFolder(path.join(__dirname, sourcePath));
      }

      return this;
    }

    loadElementCommands() {
      let commandDefinitions = require(ElementCommandFiles)(this.nightwatchInstance);
      let entries = Object.keys(commandDefinitions);

      entries.forEach(function(commandName) {
        let extraArgsCount = commandDefinitions[commandName];
        let loader = new ElementCommandLoader(this.nightwatchInstance);

        loader.commandName = commandName;
        loader.createWrapper(extraArgsCount);
        loader.define();
      });

      return this;
    }

    loadCustomCommands() {
      if (this.nightwatchInstance.options.custom_commands_path) {
        this.loadCommandsFolder(this.nightwatchInstance.options.custom_commands_path, true);
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
      return function assertFn(...args) {
        assertFn.name = prop;

        let passed;
        let expected = null;
        let actual = null;
        let lastArgument = args[args.length-1];
        let isLastArgString = typeof lastArgument === 'string';
        let message = isLastArgString &&
          (args.length > 2 || typeof args[0] === 'boolean') && lastArgument
          || (typeof args[0] === 'function' && '[Function]');

        try {
          assertModule[prop].apply(null, args);
          passed = true;
          message = `Passed [${prop}]: ${message || ApiLoader.getStaticAssertMessage(prop, args, passed)}`;
        } catch (ex) {
          passed = false;
          message = `Failed [${prop}]: (${ex.message || message || ApiLoader.getStaticAssertMessage(prop, args, passed)})`;
          actual = ex.actual;
          expected = ex.expected;
        }

        NightwatchAssertion.runAssertion(passed, {
          actual: actual,
          expected: expected
        }, assertFn, message, abortOnFailure, assertFn.stackTrace);

        return this.nightwatchInstance.api;
      }.bind(this);
    }

    static getStaticAssertMessage(prop, args, passed) {
      if (!Array.isArray(ApiLoader.assertOperators[prop])) {
        return ApiLoader.assertOperators[prop] || '';
      }

      let operator = passed ? ApiLoader.assertOperators[prop][0] : ApiLoader.assertOperators[prop][1];

      if (args.length === 2) {
        args.splice(1, 0, operator);
      } else {
        args.push(operator);
      }

      args = args.map(function(argument) {
        if (argument && typeof argument == 'object') {
          argument = util.inspect(argument);
        }

        return argument;
      });

      return args.join(' ');
    }

    loadStaticAssertions() {
      Object.keys(assertModule).forEach(prop => {
        this.nightwatchInstance.setApiMethod(prop, 'assert', (function(prop) {
          return this.createStaticAssertion(prop, true);
        }.bind(this))(prop));

        if (this.nightwatchInstance.startSessionEnabled) {
          this.nightwatchInstance.setApiMethod(prop, 'verify', (function(prop) {
            return createStaticAssertion(prop, true);
          }.bind(this))(prop));
        }
      });

      return this;
    }

    loadAssertions(folder = AssertionsBasePath, isUserDefined = false) {
      if (Array.isArray(folder)) {
        folder.forEach(item => {
          this.loadAssertions(item);
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
              .define();
          }
        });
      }

      return this;
    }

    loadCustomAssertions() {
      this.loadAssertions(this.nightwatchInstance.options.custom_assertions_path, true);
    }

    loadStaticExpect() {
      try {
        let chaiExpect = module.require('chai').expect;
        this.nightwatchInstance.setApiProperty('expect', function() {
          return chaiExpect.apply(chaiExpect, arguments);
        });
      } catch (err) {
        this.nightwatchInstance.setApiProperty('expect', {});
      }

      return this;
    }

    loadExpectAssertions() {
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

      let expectLoader = new ExpectElementLoader(this.nightwatchInstance);
      expectLoader.createWrapper().define();

      let commandFiles = fs.readdirSync(ExpectDefinitionsPath);
      commandFiles.forEach(commandFile => {
        let loader = new ExpectAssertionLoader(this.nightwatchInstance);
        loader.ignoreUnderscoreLeadingNames = true;
        loader.loadModule(ExpectDefinitionsPath, commandFile).loadAssertion();
      });

      return this;
    }

    loadPageObjects(sourcePath = null) {
      if (typeof this.nightwatchInstance.options.page_objects_path != 'string') {
        return;
      }

      sourcePath = sourcePath || this.nightwatchInstance.options.page_objects_path;

      if (Array.isArray(sourcePath)) {
        sourcePath.forEach(item => {
          this.loadPageObjects(item);
        });
        return;
      }

      let pageFiles = fs.readdirSync(sourcePath);

      for (let i = 0, len = pageFiles.length; i < len; i++) {
        let loader = new PageObjectLoader(this.nightwatchInstance);
        loader.loadModule(sourcePath, pageFiles[i]).createWrapper().define();
      }
    }
  }

  this.init = function(nightwatchInstance) {
    let api = ApiLoader(nightwatchInstance);

    api
      .loadCommands()
      .loadElementCommands()
      .loadCustomCommands()
      .loadStaticAssertions()
      .loadAssertions()
      .loadStaticExpect()
      .loadExpectAssertions()
      .loadPageObjects();

  };
})();
