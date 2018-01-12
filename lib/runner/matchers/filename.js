const path = require('path');
const minimatch = require('minimatch');

const MatchRegister = {
  exclude: {},
  filter: {}
};

class MatcherExclude {
  constructor(sourcePath) {
    this.sourcePath = sourcePath;
    this.filePaths = null;
  }

  adaptFilePath(excludedPath) {
    if (!Array.isArray(excludedPath)) {
      excludedPath = [excludedPath];
    }

    this.filePaths = excludedPath.map(item => {
      let pathResolved = path.resolve(item);

      if (pathResolved.indexOf(this.sourcePath) === 0) {
        return pathResolved;
      }

      if (item.charAt(item.length-1) === path.sep) {
        item = item.substring(0, item.length-1);
      }

      return path.join(this.sourcePath, item);
    });
  }

  match(filePath) {
    for (let i = 0; i < this.filePaths.length; i++) {
      if (minimatch(filePath, this.filePaths[i])) {
        return true;
      }
    }

    return false;
  }
}

class FilenameMatcher {
  static get TYPE_EXCLUDE() {
    return 'exclude';
  }

  static get TYPE_FILTER() {
    return 'filter';
  }

  static create(type, sourcePath) {
    switch (type) {
      case FilenameMatcher.TYPE_EXCLUDE:
      case FilenameMatcher.TYPE_FILTER:
        return new MatcherExclude(sourcePath);
    }
  }

  static isFolderExcluded(resource, opts) {
    if (!opts.exclude) {
      return false;
    }

    return MatchRegister.exclude.some(function(item) {
      if (item.indexOf(resource) === -1) {
        return false;
      }

      try {
        // FIXME: make this async
        return fs.statSync(item).isDirectory();
      } catch (err) {}

      return false;
    });

  }

  static addMatcher(type, filePath, opts) {
    let matcher = FilenameMatcher.create(type, filePath);
    matcher.adaptFilePath(opts[type]);

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

  static get register() {
    return MatchRegister;
  }
}

module.exports = FilenameMatcher;