/*!
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var util = require('util');
var events = require('events');
var assertModule = require('assert');
var CommandQueue = require('./queue.js');
var Assertion = require('./assertion.js');

module.exports = new (function() {

  var client;
  var custom_commands_path;
  var custom_assertions_path;

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
  function makeAssertion(prop, abortOnFailure) {
    return function() {
      var passed, expected = null;
      var actual = arguments[0];

      var lastArgument = arguments[arguments.length-1];
      var isLastArgString = typeof lastArgument === 'string';
      var message = isLastArgString &&
        (arguments.length > 2 || typeof arguments[0] === 'boolean') &&
        lastArgument || (typeof arguments[0] === 'function' && '[Function]') ||
        '' + actual;

      try {
        assertModule[prop].apply(null, arguments);
        passed = true;
        message = 'Assertion passed: ' + message;
      } catch (ex) {
        passed = false;
        message = 'Assertion failed: ' + (ex.message || message);
        actual = ex.actual;
        expected = ex.expected;
      }

      return Assertion.assert(passed, actual, expected, message, abortOnFailure);
    };
  }

  /**
   * Loads the available assertions
   */
  function loadAssertions() {
    client.api.assert = {};
    client.api.verify = {};

    for (var prop in assertModule) {
      if (assertModule.hasOwnProperty(prop)) {
        client.api.assert[prop] = (function(prop) {
          return makeAssertion(prop, true);
        })(prop);

        client.api.verify[prop] = (function(prop) {
          return makeAssertion(prop, false);
        })(prop);
      }
    }

    var dirPath = path.join(__dirname, './../selenium/assertions/');

    loadAssertionFiles(dirPath, client.api.assert, true);
    loadAssertionFiles(dirPath, client.api.verify, false);
  }

  /**
   * Create an instance of an assertion
   *
   * @param {function} assertionFn
   * @param {boolean} abortOnFailure
   * @param {object} client
   * @returns {AssertionInstance}
   */
  function createAssertion(commandName, assertionFn, abortOnFailure, parent) {
    var assertion;
    if (typeof assertionFn === 'object' && assertionFn.assertion) {
      assertion = Assertion.factory(assertionFn.assertion, abortOnFailure, client);
      addCommand(commandName, assertion._commandFn, assertion, parent);
      return assertion;
    }

    // backwards compatibility
    var module = loadCommandModule(assertionFn, client.api, {
      abortOnFailure : abortOnFailure
    });

    addCommand(commandName, module.command, module.context, parent);
    return assertion;
  }

  /**
   * Loads the actual assertion files.
   *
   * @param {String} dirPath
   * @param {Object} parent
   * @param {Boolean} abortOnFailure
   */
  function loadAssertionFiles(dirPath, parent, abortOnFailure) {
    var commandFiles = fs.readdirSync(dirPath);

    for (var i = 0, len = commandFiles.length; i < len; i++) {
      if (path.extname(commandFiles[i]) === '.js') {
        var commandName = path.basename(commandFiles[i], '.js');
        var assertionFn = require(path.join(dirPath, commandFiles[i]));
        createAssertion(commandName, assertionFn, abortOnFailure, parent);
      }
    }
  }

  /////////////////////////////////////////////////////////////////////
  // Commands
  /////////////////////////////////////////////////////////////////////
  /**
   * Loads selenium protocol actions
   */
  function loadProtocolActions() {
    var protocol = require('./../selenium/protocol.js')(client);
    var actions  = Object.keys(protocol);
    actions.forEach(function(command) {
      addCommand(command, protocol[command], client.api, client.api);
    });
  }

  /**
   * Loads the composite commands defined by nightwatch
   */
  function loadClientCommands() {
    // adding element specific commands
    var elementCommands = require('./../selenium/element-commands.js')(client);
    var entries  = Object.keys(elementCommands);
    entries.forEach(function(command) {
      addCommand(command, elementCommands[command], client.api, client.api);
    });

    // adding client specific commands
    var clientCommands = require('./../selenium/client-commands.js')(client);
    entries  = Object.keys(clientCommands);
    entries.forEach(function(command) {
      addCommand(command, clientCommands[command], client.api, client.api, true);
    });

    loadCommandFiles(client.api);
  }

  /**
   * Loads the external commands
   */
  function loadCommandFiles(context) {
    var relativePath = './../selenium/commands/';
    var commandFiles = fs.readdirSync(path.join(__dirname, relativePath));
    var commandName;
    var commandModule;

    for (var i = 0, len = commandFiles.length; i < len; i++) {
      var ext = path.extname(commandFiles[i]);
      commandName = path.basename(commandFiles[i], ext);
      if (ext === '.js' && commandName.substr(0, 1) !== '_') {
        commandModule = require(__dirname + relativePath + commandFiles[i]);
        var m = loadCommandModule(commandModule, context);
        addCommand(commandName, m.command, m.context, client.api);
      }
    }
  }


  /**
   * Loads a command module either specified as an object with a `command` method
   * or specified as a function which will be instantiated (new function() {..})
   *
   * @param {object|function} module
   * @param {object} context
   * @returns {{command: function, context: *}}
   */
  function loadCommandModule(module, context, addt_props) {
    var m = {command: null, context: context};

    function F() {
      if (typeof module === 'object') {
        events.EventEmitter.call(this);
      }
      if (addt_props) {
        for (var prop in addt_props) {
          if (addt_props.hasOwnProperty(prop)) {
            this[prop] = addt_props[prop];
          }
        }
      }
      this.client = client;
      this.api = client.api;
      if (typeof module === 'function') {
        module.call(this);
      }
    }

    if (typeof module === 'object' && module.command) {
      util.inherits(F, events.EventEmitter);
      F.prototype.command = module.command;
    } else if (typeof module === 'function') {
      F.prototype = Object.create(module.prototype);
      F.prototype.constructor = F;
    }

    m.command = function() {
      var instance = new F();
      if (typeof module === 'function') {
        context = m.context = instance;
      }
      instance.command.apply(context, arguments);
      return context;
    };

    return m;
  }

  /**
   * Loads custom commands defined by the user
   * @param {string} [dirpath]
   * @param {object} [parent]
   */
  function loadCustomCommands(dirpath, parent) {
    if (!custom_commands_path && !dirpath) {
      return;
    }

    dirpath = dirpath || custom_commands_path;
    parent = parent || client.api;

    var absPath = path.join(process.cwd(), dirpath);
    var commandFiles = fs.readdirSync(absPath);

    commandFiles.forEach(function(file) {
      if (path.extname(file) === '.js') {
        var commandModule = require(path.join(absPath, file));
        var name = path.basename(file, '.js');

        if (!commandModule) {
          throw new Error('Module ' + file + 'should have a public method or function.');
        }

        var m = loadCommandModule(commandModule, client.api);
        addCommand(name, m.command, m.context, parent, true);
      }
    });
  }

  /**
   * Loads custom assertions, similarly to custom commands
   */
  function loadCustomAssertions() {
    if (!custom_assertions_path) {
      return;
    }

    var absPath = path.join(process.cwd(), custom_assertions_path);
    loadAssertionFiles(absPath, client.api.assert, true);
    loadAssertionFiles(absPath, client.api.verify, false);

  }

  /**
   * Adds a command/assertion to the queue.
   *
   * @param {String} name
   * @param {Object} command
   * @param {Object} context
   * @param {Object} [parent]
   */
  function addCommand(name, command, context, parent, resetQueue) {
    parent = parent || client.api;
    if (parent[name]) {
      client.results.errors++;
      var error = new Error('The command "' + name + '" is already defined!');
      client.errors.push(error.stack);
      throw error;
    }
    parent[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      CommandQueue.add(name, command, context, args, resetQueue);
      return client.api; // for chaining
    };
  }

  /**
   * Initialize the api
   *
   * @param {Object} c The nightwatch client instance
   * @api public
   */
  this.init = function(c) {
    client = c;
    custom_commands_path = c.options.custom_commands_path;
    custom_assertions_path = c.options.custom_assertions_path;
    return this;
  };

  /**
   * Loads everything
   */
  this.load = function() {
    loadProtocolActions();
    loadClientCommands();
    loadAssertions();
    loadCustomCommands();
    loadCustomAssertions();
    return this;
  };

  this.addCommand = addCommand;
  this.loadCustomCommands = loadCustomCommands;
  this.loadCustomAssertions = loadCustomAssertions;
  this.createAssertion = createAssertion;
})();
