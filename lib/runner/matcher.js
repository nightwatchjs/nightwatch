module.exports = {
  /**
   * @param {string} testFilePath - file path of a test
   * @param {array} tags - tags to match
   * @returns {boolean} true if specified test matches given tag
   */
  tags: function (testFilePath, tags) {

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
   * @param {array} tags - tags to match
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

    testTags
      .map(function (testTag) {
        return testTag.toLowerCase();
      })
      .some(function (testTag) {
        match = (tags.indexOf(testTag) !== -1);
        return match;
      });

    return match;
  }
};
