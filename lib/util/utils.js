var path = require('path');
var Util = module.exports = {};

Util.formatElapsedTime = function(timeMs, includeMs) {
  var seconds = timeMs/1000;
  return (seconds < 1 && timeMs + 'ms') ||
    (seconds > 1 && seconds < 60 && (seconds + 's')) ||
    (Math.floor(seconds/60) + 'm' + ' ' + Math.floor(seconds%60) + 's' + (includeMs ? (' / ' + timeMs + 'ms') : ''));
};

/**
 * Wrap a synchronous function, turning it into an async fn with a callback as
 * the last argument if necessary. `asyncArgCount` is the expected argument
 * count if `fn` is already asynchronous.
 *
 * @param {number} asyncArgCount
 * @param {function} fn
 * @param {object} [context]
 */
Util.makeFnAsync = function (asyncArgCount, fn, context) {
  if (fn.length === asyncArgCount) {
    return fn;
  }

  return function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var done = args.pop();
    context = context || null;
    fn.apply(context, args);
    done();
  };
};

Util.checkFunction = function(name, parent) {
  return parent && (typeof parent[name] == 'function') && parent[name] || false;
};

Util.getTestSuiteName = function(moduleName) {
  var words;

  moduleName = moduleName.replace(/(_|-|\.)*([A-Z]*)/g, function(match, $0, $1, offset, string) {
    if (!match) {
      return '';
    }
    return (offset > 0 && (string.charAt(offset-1) !== ' ') ? ' ':'') + $1;
  });

  words = moduleName.split(/(\s|\/)/).map(function(word, index, matches) {
    if (word == '/') {
      return ' / ';
    }
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  return words.join('');
};

var formatRegExp = /%[sdj%]/g;
/**
 * A smaller version of util.format that doesn't support json and
 * if a placeholder is missing, it is omitted instead of appended
 *
 * @param f
 * @returns {string}
 */
Util.format = function format(f) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  return String(f).replace(formatRegExp, function(x) {
    if (x === '%%') {
      return '%';
    }
    if (i >= len) {
      return x;
    }
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      default:
        return x;
    }
  });
};

Util.getScreenshotFileName = function(prefix, screenshots_path) {
  prefix = prefix.replace(/\s/g, '-').replace(/"|'/g, '');

  var d = new Date();
  var dateParts = d.toString().replace(/:/g,'').split(' ');
  dateParts.shift();
  dateParts.pop();
  var dateStamp = dateParts.join('-');
  return path.resolve(path.join(screenshots_path, prefix + '_' + dateStamp + '.png'));
};

Util.isObject = function(obj) {
  return (typeof obj == 'object') && (obj !== null);
};

Util.processAsyncQueue = function(concurrency, files, cb) {
  var maxWorkers = Math.min(concurrency, files.length);
  var queue = [];
  var add = function(item) {
    queue.push(item);
  };

  var workers = 0;
  var index = 0;
  var next = function() {
    workers -= 1;
    process();
  };

  for (var i = 0; i < files.length; i++) {
    add(files[i]);
  }

  var process = function() {
    while (workers < maxWorkers) {
      workers += 1;

      if (queue.length) {
        var item = queue.shift();
        cb(item, index++, next);
      }
    }
  };

  process();
};

Util.getModuleKey = function(filePath, srcFolders, fullPaths) {
  var modulePathParts = filePath.split(path.sep);
  var diffInFolder = '';
  var folder = '';
  var parentFolder = '';
  var moduleName = modulePathParts.pop();
  filePath = modulePathParts.join(path.sep);

  if (srcFolders) {
    for (var i = 0; i < srcFolders.length; i++) {
      folder = path.resolve(srcFolders[i]);
      if (fullPaths.length > 1) {
        parentFolder = folder.split(path.sep).pop();
      }
      if (filePath.indexOf(folder) === 0) {
        diffInFolder = filePath.substring(folder.length + 1);
        break;
      }
    }
  }

  return path.join(parentFolder, diffInFolder, moduleName);
};