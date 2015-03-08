var path = require('path');
var minimatch = require('minimatch');

function adaptFilePath(filePath, excludedPath) {
  if (excludedPath.charAt(excludedPath.length-1) === path.sep) {
    excludedPath = excludedPath.substring(0, excludedPath.length-1);
  }
  return path.join(filePath, excludedPath);
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
     * @param {Array} tags - tags to match
     * @returns {boolean} true if specified test matches given tag
     */
    match : function (testFilePath, tags) {
      var test;

      try {
        test = require(testFilePath);
      } catch (e) {
        // could not load test module
        return false;
      }

      return this.checkModuleTags(test, tags);
    },

    /**
     * @param {object} test - test module
     * @param {Array} tags - tags to match
     * @returns {boolean}
     */
    checkModuleTags: function (test, tags) {
      var testTags = test.tags;
      var match    = false;

      if (typeof tags === 'string') {
        tags = [tags];
      }

      if (!Array.isArray(testTags)) {
        return false;
      }

      tags = tags.map(function (tag) {
        return tag.toLowerCase();
      });

      match = testTags
        .map(function (testTag) {
          return testTag.toLowerCase();
        })
        .some(function (testTag) {
          return (tags.indexOf(testTag) !== -1);
        });

      return match;
    }
  },

  exclude : {
    adaptFilePath : adaptFilePath,
    match : matchFilePath
  },

  filter : {
    adaptFilePath : adaptFilePath,
    match : matchFilePath
  }
};
