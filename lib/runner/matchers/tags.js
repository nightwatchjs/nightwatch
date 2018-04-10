const Logger = require('../../util/logger.js');

class TagsMatcher {
  constructor(settings) {
    this.settings = settings;
  }

  checkModuleTags(testModule) {
    let moduleTags = testModule['@tags'] || testModule.tags;
    let match = true;

    if (!Array.isArray(moduleTags)) {
      return this.settings.tag_filter === undefined && this.settings.skiptags !== undefined;
    }

    if (this.settings.tag_filter || this.settings.skiptags) {
      moduleTags = this.convertTagsToString(moduleTags);

      if (this.settings.tag_filter) {
        match = this.containsTag(moduleTags, this.convertTagsToString(this.settings.tag_filter));
      }

      if (this.settings.skiptags) {
        match = this.excludesTag(moduleTags, this.convertTagsToString(this.settings.skiptags));
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
}

module.exports = TagsMatcher;