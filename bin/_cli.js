/**
 * Module dependencies
 */
var opt = require('optimist');

module.exports = new (function() {

  var _DEFAULTS_ = {};
  var _COMMANDS_ = {};

  function Command(name) {
    this.name = name;
    _DEFAULTS_[this.name] = {};
  }

  Command.prototype.demand = function(value) {
    if (!value && _DEFAULTS_[this.name].demand) {
      return _DEFAULTS_[this.name].demand;
    }
    _DEFAULTS_[this.name].demand = value;
    return this;
  };

  Command.prototype.description = function(value) {
    if (!value && _DEFAULTS_[this.name].description) {
      return _DEFAULTS_[this.name].alias;
    }
    _DEFAULTS_[this.name].description = value;
    return this;
  };

  Command.prototype.alias = function(value) {
    if (!value && _DEFAULTS_[this.name].alias) {
      return _DEFAULTS_[this.name].alias;
    }
    _DEFAULTS_[this.name].alias = value;
    return this;
  };

  Command.prototype.defaults = function(value) {
    if (!value && _DEFAULTS_[this.name]['default']) {
      return _DEFAULTS_[this.name]['default'];
    }
    _DEFAULTS_[this.name]['default'] = value;
    return this;
  };

  Command.prototype.isDefault = function(value) {
    if (_DEFAULTS_[this.name]['default'] === value) {
      return true;
    }
    return false;
  };


  this.showHelp = function() {
    return opt.showHelp();
  };

  this.command = function(name) {
    if (_COMMANDS_[name]) {
      return _COMMANDS_[name];
    }
    _COMMANDS_[name] = new Command(name);

    return _COMMANDS_[name];
  };

  this.init = function() {
    return opt.usage('Usage: $0 [options]').options(_DEFAULTS_).argv;
  };

})();
