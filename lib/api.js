/*!
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var assertModule = require('assert');
var CommandQueue = require('./queue.js');
var Assertion = require('./assertion.js');

module.exports = new (function() {
  
  var client;
  var custom_commands_path;
  
  /**
   * Loads selenium protocol actions
   */
  function loadProtocolActions() {
    var protocol = require('./selenium/protocol.js');
    var actions  = Object.keys(protocol.actions);
    actions.forEach(function(command, index) {
      addCommand(command, protocol.actions[command], client);
    });
  };
  
  /**
   * Loads the composite commands defined by nightwatch
   */
  function loadCommands() {
    var Commands = require('./selenium/commands.js')(client);
    var entries  = Object.keys(Commands);
    entries.forEach(function(command, index) {
      addCommand(command, Commands[command], client);
    });
    
    loadCommandFiles(client);
  };
  
  /**
   * Loads the external commands
   */
  function loadCommandFiles(context) {
    var relativePath = '/commands/';
    var commandFiles = fs.readdirSync(__dirname + relativePath);
    var command;
    var commandName;
    var commandModule;
    
    for (var i = 0, len = commandFiles.length; i < len; i++) {
      if (path.extname(commandFiles[i]) == ".js") {
        commandName = path.basename(commandFiles[i], '.js');
        commandModule = require(__dirname + relativePath + commandFiles[i]);
        if (typeof commandModule == 'object' && commandModule.command) {
          command = commandModule.command;  
        } else {
          var m = new commandModule();
          m.client = this;
          command = m.command;  
          context = m;
        }
        addCommand(commandName, command, context);
      }
    }  
  };
  
  /**
   * Loads custom commands defined by the user
   */
  function loadCustomCommands() {
    if (!custom_commands_path) {
      return;
    }
    
    var absPath = path.join(process.cwd(), custom_commands_path);
    var commandFiles = fs.readdirSync(absPath);
    
    commandFiles.forEach(function(file) {
      if (path.extname(file) == '.js') {
        var command = require(path.join(absPath, file));
        var name = path.basename(file, '.js');
        addCommand(name, command.command, client.api, client.api);
      }
    });
  };
  
  function makeAssertion(prop, abortOnFailure) {
    return function() {
      var passed, message, expected = null;
      var actual = arguments[0];
      
      var lastArgument = arguments[arguments.length-1];
      var isLastArgString = typeof lastArgument == 'string';
      
      var message = isLastArgString && (arguments.length > 2 || typeof arguments[0] === 'boolean') && lastArgument
                    || (typeof arguments[0] === 'function' && '[Function]')
                    || '' + actual;
      
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
  };
  
  /**
   * Loads the available assertions
   */
  function loadAssertions() {
    client.api.assert = client.api.verify = {};
    
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
  };
  
  var AbstractAssertion = function(abortOnFailure, client) {
    this.abortOnFailure = abortOnFailure;
    this.client = client;
  };
  
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
      if (path.extname(commandFiles[i]) == '.js') {
        var commandName = path.basename(commandFiles[i], '.js');
        var Module = require(path.join(__dirname, relativePath) + commandFiles[i]);
        var m = new Module();
        AbstractAssertion.call(m, abortOnFailure, client.api);
        addCommand(commandName, m.command, m, parent);
      }
    }    
  };
  
  /**
   * Adds a command to the queue.
   *  
   * @param {String} name
   * @param {Object} command
   * @param {Object} context
   * @param {Object} parent
   */
  function addCommand(name, command, context, parent) {
    parent = parent || client;
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
  };
  
  /**
   * Initialize the api
   * 
   * @param {Object} c The nightwatch client instance
   * @api public
   */
  this.init = function(c) {
    client = c;
    custom_commands_path = c.options.custom_commands_path;
    
    loadProtocolActions();
    loadCommands();
    loadAssertions();
    loadCustomCommands(); 
  };
});
