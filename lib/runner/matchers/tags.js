const Logger = require('../../util/logger.js');

class TagsMatcher {
  constructor(settings) {
    this.includeTags = TagsMatcher.convertTags(settings.tag_filter);
    this.excludeTags = TagsMatcher.convertTags(settings.skiptags);
  }

  /**
   * @param {string|Array} tagStringOrArray
   * @return {Array}
   */
  static convertTags(tagStringOrArray) {
    if (Array.isArray(tagStringOrArray)) {
      return tagStringOrArray;
    }

    if (typeof tagStringOrArray == 'string' && tagStringOrArray.length > 0) {
      return tagStringOrArray.split(',');
    }

    return [];
  }

  checkModuleTags(testModule) {
    let moduleTags = testModule['@tags'] || testModule.tags;
    let match = true;

    if (!Array.isArray(moduleTags)) {
      return this.includeTags.length === 0;
    }

    if (this.includeTags || this.excludeTags) {
      moduleTags = this.convertTagsToString(moduleTags);

      if (this.includeTags.length > 0) {
        match = this.containsTag(moduleTags, this.convertTagsToString(this.includeTags));
      }

      if (this.excludeTags.length > 0) {
        match = this.excludesTag(moduleTags, this.convertTagsToString(this.excludeTags));
      }
    }

    return match;
  }

  convertTagsToString(tags) {
    return [].concat(tags).map(function(tag) {
      return String(tag).toLowerCase();
    });
  }

  containsTag(moduleTags, tags) {
    return moduleTags.some(function(testTag) {
      return tags.indexOf(testTag) > -1;
    });
  }

  excludesTag(moduleTags, tags) {
    return moduleTags.every(function(testTag) {
      return tags.indexOf(testTag) === -1;
    });
  }

  /**
   * @param {string} testFilePath - file path of a test
   * @returns {boolean} true if specified test matches given tag
   */
  match(testFilePath) {
    let testModule;

    try {
      testModule = require(testFilePath);
    } catch (err) {
      err.message = `An error occurred while reading file "${testFilePath}": ${err.message}`;
      Logger.error(err);

      return false;
    }

    if (testModule.disabled || testModule['@disabled']) {
      return false;
    }

    return this.checkModuleTags(testModule);
  }

  anyTagsDefined() {
    return this.includeTags.length || this.excludeTags.length;
  }
}

module.exports = TagsMatcher;