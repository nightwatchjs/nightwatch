const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');

class TagsMatcher {
  static get SEPARATOR() {
    return ',';
  }
  /**
   * @param {string|number|Array} tags
   * @return {Array}
   */
  static convertTags(tags) {
    let tagsArray = Array.isArray(tags) ? tags : [];
    
    if (Utils.isString(tags) && tags.length > 0) {
      tagsArray = tags.split(TagsMatcher.SEPARATOR);
    } else if (Utils.isNumber(tags)) {
      tagsArray.push(tags);
    }

    // convert individual tags to strings
    return tagsArray.map(tag => String(tag).toLowerCase());
  }
  
  containsTag(moduleTags) {
    return moduleTags.some(testTag => {
      return this.tagsToIncludeArray.includes(testTag);
    });
  }

  excludesTag(moduleTags) {
    return moduleTags.every(testTag => {
      return !this.tagsToSkipArray.includes(testTag);
    });
  }
  
  constructor(settings) {
    this.tagsToIncludeArray = TagsMatcher.convertTags(settings.tag_filter);
    this.tagsToSkipArray = TagsMatcher.convertTags(settings.skiptags);
  }
  
  hasIncludeTagFilter() {
    return this.tagsToIncludeArray.length > 0;   
  }
  
  hasSkipTagFilter() {
    return this.tagsToSkipArray.length > 0;   
  }
  
  checkModuleTags(testModule) {
    const moduleTags = TagsMatcher.convertTags(testModule['@tags'] || testModule.tags);
    
    // if we passed the --tag argument, check if the module contains the tag (or tags)
    if (this.hasIncludeTagFilter() && !this.containsTag(moduleTags)) {
      return false;
    }

    // if we passed the --skiptags argument, check if the module doesn't contain any of the tags in the skiptags array
    if (this.hasSkipTagFilter() && !this.excludesTag(moduleTags)) {
      return false;
    }

    return true;
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
    return this.hasIncludeTagFilter() || this.hasSkipTagFilter();
  }
}

module.exports = TagsMatcher;
