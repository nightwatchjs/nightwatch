var fs = require('fs');
var path = require('path');
var util = require('util'); 
var events = require('events');
var Logger = require('../logger.js');
var Protocol = require('./protocol.js');
    
function addElementCommand(protocolAction, extraArgs) {
  var defaultUsing = 'css selector';
  var self = this;
  extraArgs = extraArgs || 0;
  var expectedArgs = 3 + extraArgs;
  return function() {
    var noopFn = function() {};
    var args  = Array.prototype.slice.call(arguments, 0);
    if (typeof args[args.length-1] != "function") {
      args.push(noopFn);
    }
    
    if (expectedArgs - args.length === 1) {
      args.unshift(defaultUsing);
    }
    
    if (args.length < expectedArgs - 1 || args.length > expectedArgs) {
      throw new Error(protocolAction + ' method expects ' + (expectedArgs - 1) + ' or ' + expectedArgs + ' arguments - ' + args.length + ' given.');
    }
    
    var using = args.shift(), value = args.shift();
    var callback = args.pop();
    
    function CommandAction() {
      events.EventEmitter.call(this);
      
      var $this = this;
      
      var el = Protocol.actions.element.call(self, using, value, function(result) {
        if (result.status !== 0) {
          callback.call(self, result);
          var errorMessage = 'Unable to locate element: "' + value + '" using: ' + using;
          self.results.errors++;
          self.errors.push(errorMessage);
          console.log(Logger.colors.red("ERROR:"), errorMessage);
          $this.emit('complete', el, $this);
        } else {
          result = result.value.ELEMENT;
          
          args.push(function(r) {
            callback.call(self, r);  
          });
          
          args.unshift(result);
          
          var c = Protocol.actions[protocolAction].apply(self, args).once('complete', function() {
            $this.emit('complete', c, $this);
          });
        }
      });
    };
    
    util.inherits(CommandAction, events.EventEmitter);
    
    return new CommandAction(); 
  };
};

module.exports = function(context) {
  var returnValue = {};
  var elementCommands = {
    /**
     * Simulates a click event on the given DOM element.
     * 
     * Uses elementIdClick protocol command.
     * 
     * Examples:
     *
     * ```
     *    this.demoTest = function (browser) {
     *      browser.click("#main ul li a.first");
     *    };
     * ```
     * 
     * @param {string} cssSelector The CSS selector used to locate the element. 
     * @param {function} [callback] Optional callback function to be called when the command finishes. The callback is called with the main instance as context and the result object as the argument.
     * @see protocol.elementIdClick
     * @api commands
     */
    'click'            : 'elementIdClick',
    'clearValue'       : 'elementIdClear',
    'getAttribute'     : ['elementIdAttribute', 1],
    'getCssProperty'   : ['elementIdCssProperty', 1],
    'getElementSize'   : 'elementIdSize',
    'getLocation'      : 'elementIdLocation',
    'getLocationInView': 'elementIdLocationInView',
    'getTagName'       : 'elementIdName',
    'getText'          : 'elementIdText',
    'getValue'         : 'elementIdValue',
    'isVisible'        : 'elementIdDisplayed',
    'moveToElement'    : ['moveTo', 2],
    'setValue'         : ['elementIdValue', 1],
    'submitForm'       : 'submit'
  };

  for (var commandName in elementCommands) {
    var args = elementCommands[commandName];
    if (!Array.isArray(args)) {
      args = [args];
    }
    
    returnValue[commandName] = addElementCommand.apply(context, args);
  }
  
  return returnValue;
};