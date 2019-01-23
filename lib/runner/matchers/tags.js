const Logger = require('../../util/logger.js');

class TagsMatcher {
  /**
   * @param {string|number|Array} tagStringOrArray
   * @return {Array}
   */
  static convertTags(tagStringOrArray) {
    let tagsArray;
    if (Array.isArray(tagStringOrArray)) {
      tagsArray = tagStringOrArray;
    } else if (typeof tagStringOrArray == 'string' && tagStringOrArray.length > 0) {
      tagsArray = tagStringOrArray.split(',');
    } else if (tagStringOrArray) {
      tagsArray = [tagStringOrArray];
    } else {
      tagsArray = [];
    }

    return tagsArray.map((t)=>String(t).toLowerCase());
  }

  constructor(settings) {
    this.includeTags = TagsMatcher.convertTags(settings.tag_filter);
    this.excludeTags = TagsMatcher.convertTags(settings.skiptags);
  }
  
  checkModuleTags(testModule) {
    let moduleTags = TagsMatcher.convertTags(testModule['@tags'] || testModule.tags);

    if (moduleTags.length === 0) {
      return this.includeTags.length === 0;
    }

    let match = true;
    if (this.includeTags.length > 0) {
      match = this.containsTag(moduleTags, this.includeTags);
    }

    if (this.excludeTags.length > 0) {
      match = this.excludesTag(moduleTags, this.excludeTags);
    }

    return match;
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
