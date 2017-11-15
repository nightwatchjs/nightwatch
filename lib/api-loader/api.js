const fs = require('fs');
const path = require('path');
const util = require('util');
const assertModule = require('assert');
const Assertion = require('./command/assertion.js');
const AssertionLoader = require('./assertion-loader.js');
const CommandLoader = require('./command-loader.js');

module.exports = new (function() {
  const assertionsBasePath = path.join(__dirname, '../api/assertions/');
  const commandsFiles = [
    '../api/protocol.js',
    ['../api/element-commands.js', '../api/element-commands/'],
    ['../api/client-commands.js', '../api/client-commands/'],
  ];

  const assertOperators = {
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

  const assertNamespaces = {
    assert: {
      abortOnFailure: true
    },
    verify: {
      abortOnFailure: false
    }
  };

  /////////////////////////////////////////////////////////////////////
  // Commands
  /////////////////////////////////////////////////////////////////////
  function addCommandDefinition(nightwatchInstance, commandName, commandFn) {
    let loader = new CommandLoader(nightwatchInstance);
    loader.commandName = commandName;
    loader.commandFn = commandFn;
    loader.define();
  }

  function loadCommandsFolder(nightwatchInstance, sourcePath) {
    if (sourcePath && Array.isArray(sourcePath)) {
      sourcePath.forEach(item => {
        loadCommandsFolder(nightwatchInstance, item);
      });
      return;
    }

    let commandFiles = fs.readdirSync(sourcePath);
    for (let i = 0, len = commandFiles.length; i < len; i++) {
      let loader = new CommandLoader(nightwatchInstance);
      loader.loadModule(sourcePath, commandFiles[i]).createWrapper().define();
    }

  }

  function loadCommands(nightwatchInstance, sourcePath = null) {
    if (sourcePath && Array.isArray(sourcePath)) {
      sourcePath.forEach(item => {
        loadCommands(nightwatchInstance, item);
      });
      return;
    }

    if (!sourcePath) {
      commandsFiles.forEach(source => {
        loadCommands(nightwatchInstance, source);
      });
      return;
    }

    if (CommandLoader.isFileNameValid(sourcePath)) {
      let commandDefinitions = require(path.join(__dirname, sourcePath))(nightwatchInstance);
      let entries = Object.keys(commandDefinitions);
      entries.forEach(function(commandName) {
        addCommandDefinition(nightwatchInstance, commandName, commandDefinitions[commandName]);
      });
    } else {
      loadCommandsFolder(nightwatchInstance, path.join(__dirname, sourcePath));
    }
  }


  /////////////////////////////////////////////////////////////////////
  // Assertions
  /////////////////////////////////////////////////////////////////////
  /**
   * Extends the node.js assert module
   *
   * @param client
   * @param prop
   * @param abortOnFailure
   * @returns {Function}
   */
  function makeAssertion(client, prop, abortOnFailure) {
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
        message = `Passed [${prop}]: ${message || getAssertMessage(prop, args, passed)}`;
      } catch (ex) {
        passed = false;
        message = `Failed [${prop}]: (${ex.message || message || getAssertMessage(prop, args, passed)})`;
        actual = ex.actual;
        expected = ex.expected;
      }

      let assertion = new Assertion(message);
      assertion.expected = expected;
      assertion.actual = actual;
      assertion.passed = passed;
      assertion.stackTrace = assertFn.stackTrace;
      assertion.calleeFn = assertFn;
      assertion.abortOnFailure = abortOnFailure;
      assertion.stackTraceTitle = true;
      assertion.assert();

      return client.api;
    };
  }

  function getAssertMessage(prop, args, passed) {
    if (!Array.isArray(assertOperators[prop])) {
      return assertOperators[prop] || '';
    }

    let operator = passed ? assertOperators[prop][0] : assertOperators[prop][1];

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

  function loadStaticAssertions(nightwatchInstance) {
    Object.keys(assertModule).forEach(function(prop) {
      nightwatchInstance.setApiMethod(prop, 'assert', (function(prop) {
        return makeAssertion(nightwatchInstance, prop, true);
      })(prop));

      if (nightwatchInstance.startSessionEnabled) {
        nightwatchInstance.setApiMethod(prop, 'verify', (function(prop) {
          return makeAssertion(nightwatchInstance, prop, true);
        })(prop));
      }
    });
  }

  /**
   * Loads the available assertions
   */
  function loadAssertions(nightwatchInstance, folder = assertionsBasePath) {
    if (Array.isArray(folder)) {
      folder.forEach(item => {
        loadAssertions(nightwatchInstance, item);
      });
      return;
    }

    if (nightwatchInstance.startSessionEnabled) {
      const commandFiles = fs.readdirSync(folder);

      Object.keys(assertNamespaces).forEach(namespace => {
        for (let i = 0, len = commandFiles.length; i < len; i++) {
          let loader = new AssertionLoader(nightwatchInstance);
          loader.loadModule(folder, commandFiles[i])
            .setNamespace(namespace)
            .createAssertionWrapper(assertNamespaces[namespace].abortOnFailure)
            .define();
        }
      });
    }
  }

  /**
   * Loads everything
   */
  this.loadCommands = function(nightwatchInstance) {
    loadCommands(nightwatchInstance);

    if (nightwatchInstance.options.custom_commands_path) {
      loadCommandsFolder(nightwatchInstance, nightwatchInstance.options.custom_commands_path);
    }
  };

  this.loadAssertions = function(nightwatchInstance) {
    loadStaticAssertions(nightwatchInstance);
    loadAssertions(nightwatchInstance);

    if (nightwatchInstance.options.custom_assertions_path) {
      loadAssertions(nightwatchInstance, nightwatchInstance.options.custom_assertions_path);
    }

    return this;
  };
})();
