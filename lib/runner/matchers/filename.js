const path = require('path');
const fs = require('fs');
const minimatch = require('minimatch');

const MatchRegister = {
  exclude: {},
  filter: {}
};

class MatcherExclude {
  constructor({pattern, settings, argv}) {
    this.src_folders = settings.src_folders || [];
    this.argv = argv;
    this.filterPattern = this.adaptFilterPattern(pattern);
  }

  adaptFilterPattern(pattern) {
    if (!Array.isArray(pattern)) {
      pattern = [pattern];
    }

    return pattern.map(item => {
      const pathResolved = path.resolve(item);
      let srcFolder;

      if (this.src_folders.length === 1) {
        // in case there is only one src_folder, check if the pattern is specified
        // relative to the src_folder
        srcFolder = this.src_folders[0];
      } else if (this.src_folders.length === 0 && Array.isArray(this.argv._source) && (this.argv._source.length > 0)) {
        srcFolder = this.argv._source[0];
      }

      if (srcFolder) {
        srcFolder = path.resolve(srcFolder);

        if (pathResolved.startsWith(srcFolder)) {
          return pathResolved;
        }

        return path.join(srcFolder, item);
      }

      return pathResolved;
    });
  }

  match(fullPath) {
    return this.filterPattern.some(pattern => fullPath.includes(pattern) || minimatch(fullPath, pattern));
  }
}

class FilenameMatcher {
  static get TYPE_EXCLUDE() {
    return 'exclude';
  }

  static get TYPE_FILTER() {
    return 'filter';
  }

  static create({type, pattern, settings, argv}) {
    switch (type) {
      case FilenameMatcher.TYPE_EXCLUDE:
      case FilenameMatcher.TYPE_FILTER:
        return new MatcherExclude({pattern, settings, argv});
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

  static addMatcher(type, {settings, argv}) {
    MatchRegister[type] = FilenameMatcher.create({type, pattern: settings[type], argv, settings});
  }

  /**
   * @return {*}
   */
  static get register() {
    return MatchRegister;
  }
}

module.exports = FilenameMatcher;
