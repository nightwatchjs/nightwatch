const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');

class TagsMatcher {
  static get SEPARATOR() {
    return ',';
  }

  constructor(settings) {
    this.tagsToIncludeArrays = TagsMatcher.convertFilterTags(settings.tag_filter);
    this.tagsToSkipArray = TagsMatcher.convertTags(settings.skiptags);
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

  /**
   * Verify if a given module contains or does not contain specific tags
   * @param testModule
   * @returns {boolean}
   */
  checkModuleTags(testModule) {
    const moduleTags = TagsMatcher.convertTags(testModule['@tags'] || testModule.tags);

    // if we passed the --tag argument, check if the module contains the tag (or tags)
    if (this.hasIncludeTagFilter() && !this.matchesIncludeTagFilter(moduleTags)) {
      return false;
    }

    // if we passed the --skiptags argument, check if the module doesn't contain any of the tags in the skiptags array
    if (this.hasSkipTagFilter() && !excludesAllTags(moduleTags, this.tagsToSkipArray)) {
      return false;
    }

    return true;
  }

  matchesIncludeTagFilter(moduleTags) {
    return this.tagsToIncludeArrays.some(tagsArray => containsAllTags(moduleTags, tagsArray));
  }

  /**
   * @returns {boolean}
   */
  hasIncludeTagFilter() {
    return this.tagsToIncludeArrays.length > 0;
  }

  /**
   * @returns {boolean}
   */
  hasSkipTagFilter() {
    return this.tagsToSkipArray.length > 0;
  }

  /**
   * @returns {boolean}
   */
  anyTagsDefined() {
    return this.hasIncludeTagFilter() || this.hasSkipTagFilter();
  }

  /**
   * @param {String|Number|Array} tags
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

  /**
   * @param {Array|String} tags
   * @returns {*}
   */
  static convertFilterTags(tags) {
    if (!tags) {
      return [];
    }

    // when multiple --tag arguments are passed (e.g.: --tag a --tag b)
    //  the resulting array is [a, b], otherwise it is [a]
    let tagsArray = Array.isArray(tags) ? tags : [tags];

    // now parse each --tag argument
    return tagsArray.map(t => TagsMatcher.convertTags(t));
  }
}

/**
 * Whether a given list of tags contains one particular tag
 *
 * @param {Array} moduleTags
 * @param {String} testTag
 * @returns {boolean}
 */
const containsTag = function(moduleTags, testTag) {
  return moduleTags.includes(testTag);
};

/**
 * Whether a given list of tags does not contain one particular tag
 *
 * @param {Array} moduleTags
 * @param {String} testTag
 * @returns {boolean}
 */
const excludesSingleTag = function(moduleTags, testTag) {
  return !containsTag(moduleTags, testTag);
};

/**
 * Whether a given list of tags does not contain any tags in another list
 *
 * @param {Array} moduleTags
 * @param {Array} tagsArray
 * @returns {boolean}
 */
const excludesAllTags = function(moduleTags, tagsArray) {
  return moduleTags.every(testTag => excludesSingleTag(tagsArray, testTag));
};

/**
 * Whether a given list of tags contains aall tags in another list
 *
 * @param {Array} moduleTags
 * @param {Array} tagsArray
 * @returns {boolean}
 */
const containsAllTags = function(moduleTags, tagsArray) {
  return tagsArray.every(testTag => containsTag(moduleTags, testTag));
};

module.exports = TagsMatcher;
