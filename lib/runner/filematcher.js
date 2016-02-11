var path = require('path');
var minimatch = require('minimatch');

function adaptFilePath(srcPath, excludedPath) {
  var resolved = path.resolve(excludedPath);

  if (resolved.indexOf(srcPath) === 0) {
    return resolved;
  }

  if (excludedPath.charAt(excludedPath.length-1) === path.sep) {
    excludedPath = excludedPath.substring(0, excludedPath.length-1);
  }
  return path.join(srcPath, excludedPath);
}

function matchFilePath(filePath, pathArr) {
  for (var i = 0; i < pathArr.length; i++) {
    if (minimatch(filePath, pathArr[i])) {
      return true;
    }
  }
  return false;
}

module.exports = {
  tags: {
    /**
     * @param {string} testFilePath - file path of a test
     * @param {object} opts - test options
     * @returns {boolean} true if specified test matches given tag
     */
    match : function (testFilePath, opts) {
      var test;
      var originalGlobals;

      try {
        originalGlobals = mockMochaGlobals();
        test = require(testFilePath);
        restoreOriginalGlobals(originalGlobals, testFilePath);
      } catch (e) {
        restoreOriginalGlobals(originalGlobals, testFilePath);
        // could not load test module
        return false;
      }

      return this.checkModuleTags(test, opts);
    },

    /**
     * @param {object} test - test module
     * @param {object} opts - test options
     * @returns {boolean}
     */
    checkModuleTags: function (test, opts) {
      var moduleTags = test['@tags'] || test.tags;
      var match = true;

      if (!Array.isArray(moduleTags)) {
        return typeof opts.tag_filter == 'undefined' && typeof opts.skiptags != 'undefined';
      }

      if (opts.tag_filter || opts.skiptags){
        moduleTags = this.convertTagsToString(moduleTags);

        if (opts.tag_filter) {
          match = this.containsTag(moduleTags, this.convertTagsToString(opts.tag_filter));
        }
        if (opts.skiptags) {
          match = this.excludesTag(moduleTags, this.convertTagsToString(opts.skiptags));
        }
      }

      return match;
    },

    convertTagsToString : function(tags) {
      return [].concat(tags).map(function (tag) {
        return String(tag).toLowerCase();
      });
    },

    containsTag : function(moduleTags, tags) {
      return moduleTags.some(function (testTag) {
        return (tags.indexOf(testTag) > -1);
      });
    },

    excludesTag : function(moduleTags, tags) {
      return moduleTags.every(function (testTag) {
        return (tags.indexOf(testTag) == -1);
      });
    }
  },

  exclude : {
    adaptFilePath : function(filePath, excludedPath) {
      if (!Array.isArray(excludedPath)) {
        excludedPath = [excludedPath];
      }
      return excludedPath.map(function(item) {
        return adaptFilePath(filePath, item);
      });
    },
    match : matchFilePath
  },

  filter : {
    adaptFilePath : adaptFilePath,
    match : matchFilePath
  }
};

function mockMochaGlobals() {
  var original = {};
  [
    'after',
    'afterEach',
    'before',
    'beforeEach',
    'describe',
    'it',
    'run',
    'setup',
    'suite',
    'suiteSetup',
    'suiteTeardown',
    'teardown',
    'test'
  ].forEach(function (key) {
    original[key] = global[key];
    global[key] = function () {};
  });
  return original;
}

function restoreOriginalGlobals(original, filePath) {
  // Deleting the require cache is necessary so
  // that mocha can correctly load the modules
  // once it is ready.
  delete require.cache[require.resolve(filePath)];
  Object.keys(original).forEach(function (key) {
    global[key] = original[key];
  });
}
