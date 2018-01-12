const path = require('path');
const mkpath = require('mkpath');
const fs = require('fs');
const Logger = require('./logger.js');

const formatRegExp = /%[sdj%]/g;
const indentRegex = /^/gm;
const testSuiteNameRegxp = /(_|-|\.)*([A-Z]*)/g;
const nameSeparatorRegxp = /(\s|\/)/;

const Util = module.exports = {};

Util.formatElapsedTime = function(timeMs, includeMs) {
  let seconds = timeMs/1000;

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
    let args = Array.prototype.slice.call(arguments, 0);
    let done = args.pop();
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
Util.setCallbackTimeout = function(done, fnName, timeMs, onTimeoutExpired = function() {}, onTimerStarted = function() {}) {
  let timeout = setTimeout(function() {
    let err = new Error(`done() callback timeout of ${timeMs}ms was reached while executing "${fnName}".` +
      ' Make sure to call the done() callback when the operation finishes.');
    onTimeoutExpired(err, fnName, timeout);
  }, timeMs);

  onTimerStarted(timeout);

  return function(err) {
    clearTimeout(timeout);
    done(err, true);
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
  let i = 1;
  let args = arguments;
  let len = args.length;

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
  let prefix = currentTest.module + '/' + currentTest.name;
  prefix = prefix.replace(/\s/g, '-').replace(/"|'/g, '');
  prefix += is_error ? '_ERROR' : '_FAILED';

  let d = new Date();
  let dateParts = d.toString().replace(/:/g,'').split(' ');
  dateParts.shift();
  dateParts.pop();
  let dateStamp = dateParts.join('-');

  return path.resolve(path.join(screenshots_path, prefix + '_' + dateStamp + '.png'));
};

/**
 *
 * @param fileName
 * @param content
 * @param opts
 * @param cb
 */
Util.writeScreenshotToFile = function (fileName, content, cb = function() {}) {
  let dir = path.resolve(fileName, '..');
  let fail = function(err) {
    if (Logger.isOutputEnabled()) {
      console.error(Logger.colors.yellow('Couldn\'t save screenshot to '), fileName);
    }

    Logger.warn(err);
    cb(err);
  };

  mkpath(dir, function(err) {
    if (err) {
      fail(err);
    } else {
      fs.writeFile(fileName, content, 'base64', function(err) {
        if (err) {
          fail(err);
        } else {
          cb(null, fileName);
        }
      });
    }
  });
};

Util.isObject = function(obj) {
  return (typeof obj == 'object') && (obj !== null);
};

Util.processAsyncQueue = function(concurrency, files, cb) {
  let maxWorkers = Math.min(concurrency, files.length);
  let queue = [];
  let add = function(item) {
    queue.push(item);
  };

  let workers = 0;
  let index = 0;
  let next = function() {
    workers -= 1;
    process();
  };

  for (let i = 0; i < files.length; i++) {
    add(files[i]);
  }

  let process = function() {
    while (workers < maxWorkers) {
      workers += 1;

      if (queue.length) {
        let item = queue.shift();
        cb(item, index++, next);
      }
    }
  };

  process();
};

Util.getModuleKey = function(filePath, srcFolders, fullPaths) {
  let modulePathParts = filePath.split(path.sep);
  let diffInFolder = '';
  let folder = '';
  let parentFolder = '';
  let moduleName = modulePathParts.pop();
  filePath = modulePathParts.join(path.sep);

  if (srcFolders) {
    for (let i = 0; i < srcFolders.length; i++) {
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
  let logMethod = isErr ? 'error' : 'log';
  let stackTrace;
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
  let stack = parts.reduce(function(list, line) {
    if (contains(line, [
        'node_modules',
        '(node.js:',
        '(timers.js:',
        '(events.js:',
        '(util.js:',
        '(net.js:'
      ])) {
        return list;
      }

    list.push(line);

    return list;
  }, []);

  return stack.join('\n');
};

Util.showStackTrace = function(stack) {
  let parts = stack.split('\n');
  let headline = parts.shift();

  console.error(Logger.colors.red(headline.replace(indentRegex, '   ')));
  if (parts.length > 0) {
    let result = Util.stackTraceFilter(parts);
    console.log(Logger.colors.stack_trace(result.replace(indentRegex, '   ')));
  }
};

Util.symbols = (function() {
  let ok = String.fromCharCode(10004);
  let fail = String.fromCharCode(10006);

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
  } catch (e) {}

  return false;
};

Util.fileExistsSync = function (path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {}

  return false;
};

function contains(str, text) {
  if (Array.isArray(text)) {
    for (let i = 0; i < text.length; i++) {
      if (contains(str, text[i])) {
        return true;
      }
    }
  }

  return str.indexOf(text) > -1;
}