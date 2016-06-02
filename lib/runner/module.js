var path = require('path');
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

  var currentTestcase = addtOpts && addtOpts.testcase;

  this['@testSuiteName'] = null;
  this['@attributes'] = {
    '@endSessionOnFail' : true,
    '@disabled' : false,
    '@desiredCapabilities' : {},
    '@tags' : []
  };

  this.groupName = '';
  this.setTestSuiteName();

  this.keys = this.getKeys(currentTestcase);
  if (currentTestcase && this.keys.length === 0) {
    throw new Error('Error: "' + currentTestcase + '" is not a valid testcase in the current test suite.');
  }
  this.allKeys = this.keys.slice();
  this.filePath = modulePath;

  this.modulePathParts = this.filePath.split(path.sep);
  this.moduleName = this.modulePathParts.pop();
  this.options = opts;
}

Module.prototype.get = function(key) {
  if (!key) {
    return this['@module'];
  }
  return this['@module'][key];
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

Module.prototype.call = function(fnName /* arg1, arg2 ...*/) {
  var args = Array.prototype.slice.call(arguments, 1);
  return this['@module'][fnName].apply(this['@module'], args);
};

Module.prototype.callAsync = function(fnName, api, done, expectedArgs) {
  expectedArgs = expectedArgs || 2;
  var fnAsync = Utils.makeFnAsync(expectedArgs, this['@module'][fnName], this['@module']);
  fnAsync.name = fnName;

  var args = [done];
  if (expectedArgs == 2) {
    args.unshift(api);
  }

  return fnAsync.apply(this['@module'], args);
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

  if (diffInFolder.substr(-1) == path.sep) {
    diffInFolder = diffInFolder.substring(0, diffInFolder.length-1);
  }

  this.groupName = diffInFolder.split(path.sep).pop(); // in case we're in a sub-folder
  this.moduleKey = path.join(parentFolder, diffInFolder, this.moduleName);
  return this;
};

Module.prototype.getKeys = function(currentTestcase) {
  return Object.keys(this['@module']).filter(function(element) {
    if (!this['@module'][element]) {
      return false;
    }

    var isFunction = typeof this['@module'][element] == 'function';
    if (currentTestcase) {
      return isFunction && (element === currentTestcase);
    }
    return isFunction;
  }, this);
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

Module.prototype.setTestSuiteName = function() {
  var module = this['@module'];

  var keys = Object.keys(module);
  var suiteName;

  var hasSubSuite = keys.some(function(item) {
    var isAttribute = this.isAttribute(item);
    if (isAttribute) {
      var attrName = Module.geAttributeName(item);
      this['@attributes'][attrName] = module[item];
    } else if (typeof module[item] == 'object' && module[item]) {
      suiteName = item;
      return true;
    }
    return false;
  }, this);

  if (hasSubSuite && suiteName) {
    var sections = [];
    if (this['@testSuiteName']) {
      sections.push(this['@testSuiteName']);
    }
    sections.push(suiteName);
    this['@testSuiteName'] = sections.join(' :: ');
    this['@module'] = module[suiteName];

    return this.setTestSuiteName();
  }

  return this;
};

Module.geAttributeName = function(item) {
  return (item.charAt(0) == '@' ? '' : '@') + item;
};

Module.prototype.isAttribute = function(item) {
  var attrName = Module.geAttributeName(item);
  return (attrName in this['@attributes']) && (typeof module[item] != 'function');
};

Module.prototype.getTestSuiteName = function() {
  return this['@testSuiteName'];
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
  return this['@attributes']['@endSessionOnFail'];
};

Module.prototype.isDisabled = function() {
  return this['@attributes']['@disabled'];
};

Module.prototype.desiredCapabilities = function(capability) {
  if (capability && (capability in this['@attributes']['@desiredCapabilities'])) {
    return this['@attributes']['@desiredCapabilities'][capability];
  }

  return this['@attributes']['@desiredCapabilities'];
};

module.exports = Module;