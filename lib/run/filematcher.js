var path = require('path');
var minimatch = require('minimatch');

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
    adaptFilePath : function(filePath, excludedPath) {
      if (!Array.isArray(excludedPath)) {
        excludedPath = [excludedPath];
      }
      return excludedPath.map(function(item) {
        // remove trailing slash
        if (item.charAt(item.length-1) === path.sep) {
          item = item.substring(0, item.length-1);
        }
        return path.join(filePath, item);
      });
    },

    match : function(filePath, excludePath) {
      for (var i = 0; i < excludePath.length; i++) {
        if (minimatch(filePath, excludePath[i])) {
          return true;
        }
      }
      return false;
    }
  },

  filter : {
    adaptFilePath : function(filePath, filterPath) {
      if (filterPath.charAt(filterPath.length-1) === path.sep) {
        filterPath = filterPath.substring(0, filterPath.length-1);
      }
      return path.join(filePath, filterPath);
    },

    match : function(filePath, filterPath) {
      return minimatch(filePath, filterPath);
    }
  }
};
