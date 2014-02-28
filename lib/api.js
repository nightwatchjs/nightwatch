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

    loadAssertionFiles(client.api.assert, true);
    loadAssertionFiles(client.api.verify, false);
  }

  /**
   * Create an instance of an assertion
   *
   * @param {function} assertionFn
   * @param {boolean} abortOnFailure
   * @param {object} client
   * @returns {Assertion}
   */
  function createAssertion(assertionFn, abortOnFailure, client) {
    /**
     * @param abortOnFailure
     * @param client
     * @constructor
     */
    var Assertion = function (abortOnFailure, client) {
      this.abortOnFailure = abortOnFailure;
      this.client = client;
      this.api = client.api;
    };
    Assertion.prototype.command = assertionFn;

    return new Assertion(abortOnFailure, client);
  }

  /**
   * Loads the actual assertion files.
   *
   * @param {Object} parent
   * @param {Boolean} abortOnFailure
   */
  function loadAssertionFiles(parent, abortOnFailure) {
    var relativePath = './selenium/assertions/';
    var commandFiles = fs.readdirSync(path.join(__dirname, relativePath));

    for (var i = 0, len = commandFiles.length; i < len; i++) {
      if (path.extname(commandFiles[i]) === '.js') {
        var commandName = path.basename(commandFiles[i], '.js');
        var assertionFn = require(path.join(__dirname, relativePath) + commandFiles[i]);
        var Assertion = createAssertion(assertionFn, abortOnFailure, client);

        addCommand(commandName, Assertion.command, Assertion, parent);
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
    var protocol = require('./selenium/protocol.js')(client);
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
    var elementCommands = require('./selenium/element-commands.js')(client);
    var entries  = Object.keys(elementCommands);
    entries.forEach(function(command) {
      addCommand(command, elementCommands[command], client.api, client.api);
    });

    // adding client specific commands
    var clientCommands = require('./selenium/client-commands.js')(client);
    entries  = Object.keys(clientCommands);
    entries.forEach(function(command) {
      addCommand(command, clientCommands[command], client.api, client.api);
    });

    loadCommandFiles(client.api);
  }

  /**
   * Loads the external commands
   */
  function loadCommandFiles(context) {
    var relativePath = '/selenium/commands/';
    var commandFiles = fs.readdirSync(__dirname + relativePath);
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
  function loadCommandModule(module, context) {
    var m = {command: null, context: context};

    function F() {
      if (typeof module === 'object') {
        events.EventEmitter.call(this);
      }
      this.client = client;
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

    var instance = new F();
    m.command = instance.command;
    m.context = instance;

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
          throw new Error('Module should have a public method or function.');
        }

        var m = loadCommandModule(commandModule, client.api);
        addCommand(name, m.command, m.context, parent);
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
    loadCustomCommands(custom_assertions_path, client.api.assert);
  }

  /**
   * Adds a command/assertion to the queue.
   *
   * @param {String} name
   * @param {Object} command
   * @param {Object} context
   * @param {Object} [parent]
   */
  function addCommand(name, command, context, parent) {
    parent = parent || client.api;
    if (parent[name]) {
      client.results.errors++;
      var error = new Error('The command "' + name + '" is already defined!');
      client.errors.push(error.stack);
      throw error;
    }
    parent[name] = (function(internalCommandName) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        CommandQueue.add(internalCommandName, command, context, args);
        return client.api; // for chaining
      };
    })(name);
  }

  function augmentCommand(command) {
    function Emitter() {
      events.EventEmitter.call(this);
    }
    util.inherits(Emitter, events.EventEmitter);

    var emitter = new Emitter();
    for (var key in client.api) {
      if (key in emitter) {
        throw new Error('Using the method name ' + key + ' in your commands name has dangerous side effects.');
      }
      if (client.api.hasOwnProperty(key)) {
        emitter[key] = client.api[key];
      }
    }

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
