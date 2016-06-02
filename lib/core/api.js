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
var Page = require('../page-object/page.js');

module.exports = new (function() {

  var client;
  var custom_commands_path;
  var custom_assertions_path;
  var page_objects_path;
  var assertOperators = {
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
      var passed;
      var expected = null;
      var actual = null;
      var lastArgument = arguments[arguments.length-1];
      var isLastArgString = typeof lastArgument === 'string';
      var message = isLastArgString &&
        (arguments.length > 2 || typeof arguments[0] === 'boolean') &&
        lastArgument || (typeof arguments[0] === 'function' && '[Function]');

      var args = Array.prototype.slice.call(arguments, 0);

      try {
        assertModule[prop].apply(null, arguments);
        passed = true;
        message = 'Passed [' + prop + ']: ' + (message || getAssertMessage(prop, args, passed));
      } catch (ex) {
        passed = false;
        message = 'Failed [' + prop + ']: ' + ('(' + ex.message + ')' || message || getAssertMessage(prop, args, passed));
        actual = ex.actual;
        expected = ex.expected;
      }

      return Assertion.assert(passed, actual, expected, message, abortOnFailure);
    };
  }

  function getAssertMessage(prop, args, passed) {
    if (!Array.isArray(assertOperators[prop])) {
      return assertOperators[prop] || '';
    }

    var operator = passed ? assertOperators[prop][0] : assertOperators[prop][1];

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

  /**
   * Loads the available assertions
   */
  function loadAssertions(parent) {
    parent = parent || client.api;
    parent.assert = {};
    if (client.options.start_session) {
      parent.verify = {};
    }
    for (var prop in assertModule) {
      if (assertModule.hasOwnProperty(prop)) {
        parent.assert[prop] = (function(prop) {
          return makeAssertion(prop, true);
        })(prop);
        if (client.options.start_session) {
          parent.verify[prop] = (function (prop) {
            return makeAssertion(prop, false);
          })(prop);
        }
      }
    }

    if (client.options.start_session) {
      var dirPath = path.join(__dirname, './../api/assertions/');

      loadAssertionFiles(dirPath, parent.assert, true);
      loadAssertionFiles(dirPath, parent.verify, false);
    }
  }

  /**
   * Create an instance of an assertion
   *
   * @param {string} commandName
   * @param {function} assertionFn
   * @param {boolean} abortOnFailure
   * @param {object} parent
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
  function loadProtocolActions(parent) {
    parent = parent || client.api;
    var protocol = require('./../api/protocol.js')(client);
    var actions  = Object.keys(protocol);
    actions.forEach(function(command) {
      addCommand(command, protocol[command], client.api, parent);
    });
  }

  /**
   * Loads all the composite commands defined by nightwatch
   */
  function loadAllCommands(parent) {
    loadElementCommands(parent);
    loadClientCommands(parent);
    loadCommandFiles(client.api, parent, true);
  }

  /**
   * Loads the element composite commands defined by nightwatch
   */
  function loadElementCommands(parent) {
    parent = parent || client.api;
    var elementCommands = require('./../api/element-commands.js')(client);
    var entries = Object.keys(elementCommands);
    entries.forEach(function(command) {
      addCommand(command, elementCommands[command], client.api, parent);
    });
  }

  /**
   * Loads all the client commands defined by nightwatch
   */
  function loadClientCommands(parent) {
    parent = parent || client.api;
    var clientCommands = require('./../api/client-commands.js')(client);
    var entries = Object.keys(clientCommands);
    entries.forEach(function(command) {
      addCommand(command, clientCommands[command], client.api, parent, true);
    });
  }

  /**
   * Loads the external commands
   */
  function loadCommandFiles(context, parent, shouldLoadClientCommands) {
    var relativePaths = ['./../api/element-commands/'];
    if (shouldLoadClientCommands) {
      relativePaths.push('./../api/client-commands/');
    }

    relativePaths.forEach(function(relativePath) {
      var commandFiles = fs.readdirSync(path.join(__dirname, relativePath));
      var commandName;
      var commandModule;

      for (var i = 0, len = commandFiles.length; i < len; i++) {
        var ext = path.extname(commandFiles[i]);
        commandName = path.basename(commandFiles[i], ext);
        if (ext === '.js' && commandName.substr(0, 1) !== '_') {
          commandModule = require(__dirname + relativePath + commandFiles[i]);
          var m = loadCommandModule(commandModule, context);
          addCommand(commandName, m.command, m.context, parent);
        }
      }
    });
  }

  /**
   * Loads a command module either specified as an object with a `command` method
   * or specified as a function which will be instantiated (new function() {..})
   *
   * @param {object|function} module
   * @param {object} context
   * @param {object} [addt_props]
   * @returns {{command: function, context: *}}
   */
  function loadCommandModule(module, context, addt_props, return_val) {
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
      F.prototype.command = function() {
        return module.command.apply(this, arguments);
      };
    } else if (typeof module === 'function') {
      F.prototype = Object.create(module.prototype);
      F.prototype.constructor = F;
    }

    m.command = function commandFn() {
      var instance = new F();
      if (typeof module === 'function') {
        context = m.context = instance;
      }
      instance.command.prototype.constructor.stackTrace = commandFn.stackTrace;
      instance.command.apply(context, arguments);
      return context;
    };

    return m;
  }

  /**
   * Loads custom commands defined by the user
   * @param {string} [dirPath]
   * @param {object} [parent]
   */
  function loadCustomCommands(dirPath, parent) {
    if (!custom_commands_path && !dirPath) {
      return;
    }

    dirPath = dirPath || custom_commands_path;
    parent = parent || client.api;

    if (Array.isArray(dirPath)) {
      dirPath.forEach(function(folder) {
        loadCustomCommands(folder, parent);
      });
      return;
    }

    var absPath = path.resolve(dirPath);
    var commandFiles = fs.readdirSync(absPath);

    commandFiles.forEach(function(file) {
      var fullPath = path.join(absPath, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        parent[file] = parent[file] || {};
        var pathFolder = path.join(dirPath, file);
        loadCustomCommands(pathFolder, parent[file]);
      } else if (path.extname(file) === '.js') {
        var commandModule = require(fullPath);
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
   * @param [folder]
   */
  function loadCustomAssertions(folder, parent) {
    folder = folder || custom_assertions_path;
    parent = parent || client.api;
    if (!custom_assertions_path) {
      return;
    }

    if (Array.isArray(folder)) {
      folder.forEach(function(folderName) {
        loadCustomAssertions(folderName, parent);
      });
      return;
    }

    loadCustomAssertionFolder(folder, parent);
  }

  function loadCustomAssertionFolder(folderName, parent) {
    var absPath = path.resolve(folderName);
    loadAssertionFiles(absPath, parent.assert, true);
    loadAssertionFiles(absPath, parent.verify, false);
  }

  function loadExpectAssertions(parent) {
    parent = parent || client.api;
    var Expect = require('../api/expect.js')(client);
    var assertions  = Object.keys(Expect);

    try {
      var chaiExpect = module.require('chai').expect;
      parent.expect = function() {
        return chaiExpect.apply(chaiExpect, arguments);
      };
    } catch (err) {
      parent.expect = {};
    }

    assertions.forEach(function(assertion) {
      parent.expect[assertion] = function() {
        var args = Array.prototype.slice.call(arguments);
        var command = Expect[assertion].apply(parent, args);

        function F(element) {
          events.EventEmitter.call(this);
          this.client = client;
          this.element = element;
        }
        util.inherits(F, events.EventEmitter);
        F.prototype.command = function commandFn() {
          this.element._stackTrace = commandFn.stackTrace;
          this.element.locate(this);
          return this;
        };

        var instance = new F(command.element);
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        CommandQueue.add(assertion, instance.command, instance, [], err.stack);

        return command.expect;
      };
    });
  }

  /**
   * Loads page object files
   * @param {string} [dirPath]
   */
  function loadPageObjects(dirPath, parent) {
    if (!page_objects_path && !dirPath) {
      return;
    }

    dirPath = dirPath || page_objects_path;
    client.api.page = client.api.page || {};
    parent = parent || client.api.page;

    if (Array.isArray(dirPath)) {
      dirPath.forEach(function(folder) {
        loadPageObjects(folder);
      });
      return;
    }

    var absPath = path.resolve(dirPath);
    var pageFiles = fs.readdirSync(absPath);

    pageFiles.forEach(function(file) {
      var fullPath = path.join(absPath, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        parent[file] = parent[file] || {};
        var pathFolder = path.join(dirPath, file);
        loadPageObjects(pathFolder, parent[file]);
      } else if (path.extname(file) === '.js') {
        var pageName = path.basename(file, '.js');
        var pageFnOrObject = require(path.join(absPath, file));
        addPageObject(pageName, pageFnOrObject, client.api, parent);
      }
    });
  }

  /**
   * Instantiates the page object class
   * @param {String} name
   * @param {Object} pageFnOrObject
   * @param {Object} context
   * @param {Object} parent
   */
  function addPageObject(name, pageFnOrObject, context, parent) {
    parent[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(context);

      if (useEnhancedModel(pageFnOrObject)) {
        var loadOntoPageObject = function(parent) {
          if (client.options.start_session) {
            loadElementCommands(parent);
            loadCommandFiles(client.api, parent, false);
            loadExpectAssertions(parent);
            // Alias
            parent.expect.section = parent.expect.element;
          }
          loadAssertions(parent);
          loadCustomCommands(null, parent);
          loadCustomAssertions(null, parent);
          return parent;
        };
        pageFnOrObject.name = name;
        return new Page(pageFnOrObject, loadOntoPageObject, context, client);
      }

      return new (function() {
        if (typeof pageFnOrObject == 'function') {
          return createPageObject(pageFnOrObject, args);
        }

        return pageFnOrObject;
      })();
    };
  }

  function useEnhancedModel(pageFnOrObject) {
    return typeof pageFnOrObject == 'object' && (pageFnOrObject.elements || pageFnOrObject.sections);
  }

  /**
   *
   * @param pageFnOrObject
   * @param args
   * @returns {Object}
   */
  function createPageObject(pageFnOrObject, args) {
    function PageObject() {
      return pageFnOrObject.apply(this, args);
    }
    PageObject.prototype = pageFnOrObject.prototype;
    return new PageObject();
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
    parent[name] = function commandFn() {
      var args = Array.prototype.slice.call(arguments);

      var originalStackTrace;
      if (commandFn.stackTrace) {
        originalStackTrace = commandFn.stackTrace;
      } else {
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        originalStackTrace = err.stack;
      }

      CommandQueue.add(name, command, context, args, originalStackTrace);
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
    page_objects_path = c.options.page_objects_path;
    return this;
  };

  /**
   * Loads everything
   */
  this.load = function() {
    if (client.options.start_session) {
      loadProtocolActions();
      loadAllCommands();
      loadPageObjects();
      loadExpectAssertions();
    }
    loadAssertions();
    loadCustomCommands();
    loadCustomAssertions();
    return this;
  };

  this.addCommand = addCommand;
  this.loadCustomCommands = loadCustomCommands;
  this.loadCustomAssertions = loadCustomAssertions;
  this.loadPageObjects = loadPageObjects;
  this.createAssertion = createAssertion;
})();
