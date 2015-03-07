var path = require('path');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');

function Module(modulePath, opts) {
  try {
    this['@module'] = require(modulePath);
  } catch (err) {
    throw err;
  }

  if (!this['@module']) {
    throw new Error('Invalid test suite provided.');
  }

  this.keys = Object.keys(this['@module']).filter(function(element) {
    return (typeof this['@module'][element] == 'function');
  }, this);
  this.filePath = modulePath;
  this.modulePathParts = this.filePath.split(path.sep);
  this.moduleName = this.modulePathParts.pop();
  this.suiteName = Utils.getTestSuiteName(this.moduleName);
  this.options = opts;
}

Module.prototype.get = function() {
  return this['@module'];
};

Module.prototype.getName = function() {
  return this.moduleName;
};

Module.prototype.call = function(fnName /* arg1, arg2 ...*/) {
  var args = Array.prototype.slice.call(arguments, 1);
  return this['@module'][fnName].apply(this['@module'], args);
};

Module.prototype.callAsync = function(fnName, api, complete) {
  var fnAsync = Utils.makeFnAsync(2, this['@module'][fnName]);
  fnAsync.name = fnName;
  return fnAsync.call(this['@module'], api, complete);
};

Module.prototype.removeKey = function(key) {
  var self = this;
  if (Array.isArray(key)) {
    key.forEach(function(item) {
      self.removeKey(item);
    });
    return;
  }

  var index = this.keys.indexOf(key);
  if (index > -1) {
    this.keys.splice(index, 1);
  }
};

Module.prototype.setReportKey = function(fullPaths, srcFolders) {
  var diffInFolder = '', folder, parentFolder = '';
  var filePath = this.modulePathParts.join(path.sep);
  if (srcFolders) {
    for (var i = 0; i < srcFolders.length; i++) {
      folder = path.resolve(srcFolders[i]);
      if (fullPaths.length > 1) {
        parentFolder = folder.split(path.sep).pop();
      }
      if (filePath.indexOf(folder) === 0) {
        diffInFolder = filePath.substring(folder.length + 1);
        break;
      }
    }
  }

  this.moduleKey = path.join(parentFolder, diffInFolder, this.moduleName);
  return this;
};

Module.prototype.getNextKey = function() {
  if (this.keys.length) {
    return this.keys.shift();
  }
  return null;
};

Module.prototype.isDisabled = function() {
  return this['@module'].disabled;
};

Module.prototype.setClient = function(client) {
  this['@module'].client = client;
};

Module.prototype.desiredCapabilities = function(capability) {
  if (typeof this['@module'].desiredCapabilities == 'undefined' || !this['@module'].desiredCapabilities) {
    return null;
  }

  if (capability && (capability in this['@module'].desiredCapabilities)) {
    return this['@module'].desiredCapabilities[capability];
  }

  return this['@module'].desiredCapabilities;
};

Module.prototype.print = function() {
  if (this.options.output) {
    var testSuiteDisplay = '[' + this.suiteName + '] Test Suite';
    console.log('\n' + Logger.colors.cyan(testSuiteDisplay, Logger.colors.background.black));
    console.log(Logger.colors.purple(new Array(testSuiteDisplay.length + 1).join('=')));
  }
};

module.exports = Module;