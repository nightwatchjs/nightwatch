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

      try {
        test = require(testFilePath);
      } catch (e) {
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

      if (!Array.isArray(moduleTags)) {
        return typeof opts.tag_filter == 'undefined' && typeof opts.skiptags != 'undefined';
      }

      var tags = opts.tag_filter || opts.skiptags;
      if (!Array.isArray(tags)) {
        tags = [tags];
      }

      tags = this.convertTagsToString(tags);
      moduleTags = this.convertTagsToString(moduleTags);

      if (opts.tag_filter) {
        return this.containsTag(moduleTags, tags);
      } else if (opts.skiptags) {
        return this.excludesTag(moduleTags, tags);
      }

      return true;
    },

    convertTagsToString : function(tags) {
      return tags.map(function (tag) {
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
