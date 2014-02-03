var fs = require('fs'),
    path = require('path'),
    util = require("util"), 
    events = require("events"),
    Logger = require('../logger.js'),
    Protocol = require('./protocol.js');
    
function addElementCommand(protocolCommand, extraArgs) {
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
      throw new Error(protocolCommand + ' method expects ' + (expectedArgs - 1) + ' or ' + expectedArgs + ' arguments - ' + args.length + ' given.');
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
          
          var c = Protocol.actions[protocolCommand].apply(self, args).once('complete', function() {
            $this.emit('complete', c, $this);
          });
        }
      });
    };
    
    util.inherits(CommandAction, events.EventEmitter);
    
    return new CommandAction(); 
  }
};
  
module.exports = {
  addCommands : function() {
    var specs = {
      'click' : addElementCommand.call(this, 'elementIdClick'),
      'clearValue': addElementCommand.call(this, 'elementIdClear'),
      'getAttribute' : addElementCommand.call(this, 'elementIdAttribute', 1),
      'getCssProperty' : addElementCommand.call(this, 'elementIdCssProperty', 1),
      'getElementSize' : addElementCommand.call(this, 'elementIdSize'),
      'getLocation' : addElementCommand.call(this, 'elementIdLocation'),
      'getLocationInView' : addElementCommand.call(this, 'elementIdLocationInView'),
      'getTagName' : addElementCommand.call(this, 'elementIdName'),
      'getText' : addElementCommand.call(this, 'elementIdText'),
      'getValue' : addElementCommand.call(this, 'elementIdValue'),
      'isVisible' : addElementCommand.call(this, 'elementIdDisplayed'),
      'moveToElement' : addElementCommand.call(this, 'moveTo', 2),
      'setValue' : addElementCommand.call(this, 'elementIdValue', 1),
      'submitForm' : addElementCommand.call(this, 'submit')
    };
    
    for (commandName in specs) {
      this.addCommand(commandName, specs[commandName], this);  
    }
    
    var relativePath = '/commands/';
    var commandFiles = fs.readdirSync(__dirname + relativePath);
    for (var i = 0, len = commandFiles.length; i < len; i++) {
      if (path.extname(commandFiles[i]) == ".js") {
        var commandName = path.basename(commandFiles[i], '.js');
        var Module = require(__dirname + relativePath + commandFiles[i]);
        if (typeof Module == 'object' && Module.command) {
          var command = Module.command;  
          var context = this;
        } else {
          var m = new Module();
          m.client = this;
          command = m.command;  
          context = m;
        }
        this.addCommand(commandName, command, context);
      }
    }
  }
}
