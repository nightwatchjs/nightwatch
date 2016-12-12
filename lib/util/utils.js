var path = require('path');
var fs = require('fs');
var Util = module.exports = {};
var Logger = require('./logger.js');

var formatRegExp = /%[sdj%]/g;
var testSuiteNameRegxp = /(_|-|\.)*([A-Z]*)/g;
var nameSeparatorRegxp = /(\s|\/)/;

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

/**
 * Waits a number of ms for a `done` callback to be invoked
 *
 * @param {function} done
 * @param {string} fnName
 * @param {number} timeMs
 * @param {function} [onCatch]
 * @param {function} [onTimerStarted]
 * @return {Function}
 */
Util.setCallbackTimeout = function(done, fnName, timeMs, onCatch, onTimerStarted) {
  var timeout = setTimeout(function() {
    if (onCatch) {
      var err = new Error('done() callback timeout of '+ timeMs +' ms was reached while executing "' + fnName + '".' +
        ' Make sure to call the done() callback when the operation finishes.');
      onCatch(err, fnName, timeout);
    }

  }, timeMs);

  if (onTimerStarted) {
    onTimerStarted(timeout);
  }

  return function(ex) {
    clearTimeout(timeout);
    done(ex, true);
  };
};

Util.checkFunction = function(name, parent) {
  return parent && (typeof parent[name] == 'function') && parent[name] || false;
};

Util.getTestSuiteName = function(moduleName) {
  var words;

  moduleName = moduleName.replace(testSuiteNameRegxp, function(match, $0, $1, offset, string) {
    if (!match) {
      return '';
    }
    return (offset > 0 && (string.charAt(offset-1) !== ' ') ? ' ':'') + $1;
  });

  words = moduleName.split(nameSeparatorRegxp).map(function(word, index, matches) {
    if (word == '/') {
      return ' / ';
    }
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  return words.join('');
};

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

Util.getScreenshotFileName = function(currentTest, is_error, screenshots_path) {
  var prefix = currentTest.module + '/' + currentTest.name;
  prefix = prefix.replace(/\s/g, '-').replace(/"|'/g, '');
  prefix += is_error ? '_ERROR' : '_FAILED';

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

  var workerQueue = [];
  for (var wi = 0; wi < maxWorkers; wi++) {
    workerQueue.push(wi);
  }

  var index = 0;
  var next = function(workerIndex) {
      return function() {
        workerQueue.push(workerIndex);
        process();
      };
  };

  for (var i = 0; i < files.length; i++) {
    add(files[i]);
  }

  var process = function() {
    while (workerQueue.length > 0) {
      var workerIndex = workerQueue.shift();

      if (queue.length) {
        var item = queue.shift();
        cb(item, index++, workerIndex, next(workerIndex));
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

Util.showStackTraceWithHeadline = function(headline, stack, isErr) {
  var logMethod = isErr ? 'error' : 'log';
  var stackTrace;
  console[logMethod](Logger.colors.red(headline));

  if (Array.isArray(stack) && stack.length > 0) {
    stackTrace = Util.stackTraceFilter(stack);
  } else {
    stackTrace = stack;
  }

  if (stack) {
    console[logMethod](Logger.colors.stack_trace(stackTrace));
  }
};

Util.stackTraceFilter = function(parts) {
  var stack = parts.reduce(function(list, line) {
    if (contains(line, [
        'node_modules',
        '(node.js:',
        '(events.js:'
      ])) {
        return list;
      }

    list.push(line);
    return list;
  }, []);

  return stack.join('\n');
};

var indentRegex = /^/gm;
Util.showStackTrace = function(stack) {
  var parts = stack.split('\n');
  var headline = parts.shift();

  console.log(Logger.colors.red(headline.replace(indentRegex, '   ')));
  if (parts.length > 0) {
    var result = Util.stackTraceFilter(parts);
    console.log(Logger.colors.stack_trace(result.replace(indentRegex, '   ')));
  }
};

Util.symbols = (function() {
  var ok = String.fromCharCode(10004);
  var fail = String.fromCharCode(10006);

  if (process.platform === 'win32') {
    ok = '\u221A';
    fail = '\u00D7';
  }

  return {
    ok: ok,
    fail: fail
  };
})();

Util.isErrorObject = function(err) {
  return err instanceof Error || Object.prototype.toString.call(err) === '[object Error]';
};

// util to replace deprecated fs.existsSync
Util.dirExistsSync = function (path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
};

Util.fileExistsSync = function (path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
};

function contains(str, text) {
  if (Array.isArray(text)) {
    for (var i = 0; i < text.length; i++) {
      if (contains(str, text[i])) {
        return true;
      }
    }
  }

  return str.indexOf(text) > -1;
}
