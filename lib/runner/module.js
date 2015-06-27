var path = require('path');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');

function Module(modulePath, opts, addtOpts) {
  try {
    this['@module'] = require(modulePath);
  } catch (err) {
    throw err;
  }

  if (!this['@module']) {
    throw new Error('Invalid test suite provided.');
  }

  var currentTestcase;
  if (addtOpts && addtOpts.testcase) {
    if (!(addtOpts.testcase in this['@module'])) {
      throw new Error('Error: "' + addtOpts.testcase + '" is not a valid testcase in the current test suite.');
    }
    currentTestcase = addtOpts.testcase;
  }
  this.keys = this.getKeys(currentTestcase);
  this.allKeys = this.keys.slice();
  this.filePath = modulePath;
  this.modulePathParts = this.filePath.split(path.sep);
  this.moduleName = this.modulePathParts.pop();
  this.options = opts;
}

Module.prototype.get = function() {
  return this['@module'];
};

Module.prototype.set = function(key, value) {
  if (!key || !value) {
    return this;
  }
  this['@module'][key] = value;
  return this;
};

Module.prototype.getName = function() {
  return this.moduleName;
};

Module.prototype.getKeys = function(currentTestcase) {
  return Object.keys(this['@module']).filter(function(element) {
    var isFunction = typeof this['@module'][element] == 'function';
    if (currentTestcase) {
      return isFunction && (element === currentTestcase);
    }
    return isFunction;
  }, this);
};

Module.prototype.call = function(fnName /* arg1, arg2 ...*/) {
  var args = Array.prototype.slice.call(arguments, 1);
  return this['@module'][fnName].apply(this['@module'], args);
};

Module.prototype.callAsync = function(fnName, api, complete) {
  var fnAsync = Utils.makeFnAsync(2, this['@module'][fnName], this['@module']);
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

Module.prototype.resetKeys = function() {
  this.keys = this.allKeys.slice();
};

Module.prototype.endSessionOnFail = function() {
  return (typeof this['@module']['@endSessionOnFail'] == 'undefined') || (this['@module']['@endSessionOnFail'] === true);
};

Module.prototype.isDisabled = function() {
  return this['@module']['@disabled'] || this['@module'].disabled;
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

module.exports = Module;