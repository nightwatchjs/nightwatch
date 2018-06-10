const path = require('path');
const fs = require('fs');
const minimatch = require('minimatch');

const MatchRegister = {
  exclude: {},
  filter: {}
};

class MatcherExclude {
  constructor(filterPattern, settings) {
    this.src_folders = settings.src_folders || [];
    this.filterPattern = this.adaptFilterPattern(filterPattern);
  }

  adaptFilterPattern(filtered) {
    if (!Array.isArray(filtered)) {
      filtered = [filtered];
    }

    return filtered.map(item => {
      const pathResolved = path.resolve(item);

      if (this.src_folders.length === 1) {
        // in case there is only one src_folder, check if the pattern is specified
        // relative to the src_folder
        let srcFolder = path.resolve(this.src_folders[0]);

        if (pathResolved.startsWith(srcFolder)) {
          return pathResolved;
        }

        return path.join(srcFolder, item);
      }

      return pathResolved;
    });
  }

  match(fullPath) {
    let matched = true;

    this.filterPattern.forEach(pattern => {
      matched = fullPath.includes(pattern) || minimatch(fullPath, pattern);
    });

    return matched;
  }
}

class FilenameMatcher {
  static get TYPE_EXCLUDE() {
    return 'exclude';
  }

  static get TYPE_FILTER() {
    return 'filter';
  }

  static create(type, filterPattern, settings) {
    switch (type) {
      case FilenameMatcher.TYPE_EXCLUDE:
      case FilenameMatcher.TYPE_FILTER:
        return new MatcherExclude(filterPattern, settings);
    }
  }

  static isFolderExcluded(resource, opts) {
    if (!opts.exclude) {
      return false;
    }

    return MatchRegister.exclude.filterPattern.some(function(item) {
      if (item.indexOf(resource) === -1) {
        return false;
      }

      try {
        // FIXME: make this async
        return fs.statSync(item).isDirectory(); // eslint-disable-next-line no-empty
      } catch (err) {}

      return false;
    });

  }

  static addMatcher(type, settings) {
    let matcher = FilenameMatcher.create(type, settings[type], settings);

    FilenameMatcher.register = {
      type: type,
      value: matcher
    };
  }

  static set register(val) {
    if (!val.type || !val.value) {
      throw new Error('Supplied matcher object should contain both "type" and "value" keys.');
    }

    if (MatchRegister[val.type] === undefined) {
      throw new Error('Unknown matcher: ' + val.type);
    }

    MatchRegister[val.type] = val.value;
  }

  /**
   * @return {*}
   */
  static get register() {
    return MatchRegister;
  }
}

module.exports = FilenameMatcher;