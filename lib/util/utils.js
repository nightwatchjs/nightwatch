const path = require('path');
const fs = require('fs');
const Logger = require('./logger.js');

const formatRegExp = /%[sdj%]/g;
const indentRegex = /^/gm;
const testSuiteNameRegxp = /(_|-|\.)*([A-Z]*)/g;
const nameSeparatorRegxp = /(\s|\/)/;

class Utils {
  static get PrimitiveTypes() {
    return {
      OBJECT: 'object',
      FUNCTION: 'function',
      BOOLEAN: 'boolean',
      NUMBER: 'number',
      STRING: 'string',
      UNDEFINED: 'undefined'
    };
  }

  static isObject(obj) {
    return obj !== null && typeof obj == 'object';
  }

  static isFunction(fn) {
    return typeof fn == Utils.PrimitiveTypes.FUNCTION;
  }

  static isBoolean(value) {
    return typeof value == Utils.PrimitiveTypes.BOOLEAN;
  }

  static isNumber(value) {
    return typeof value == Utils.PrimitiveTypes.NUMBER;
  }

  static isString(value) {
    return typeof value == Utils.PrimitiveTypes.STRING;
  }

  static isUndefined(value) {
    return typeof value == Utils.PrimitiveTypes.UNDEFINED;
  }

  static get symbols() {
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
  }

  static formatElapsedTime(timeMs, includeMs = false) {
    let seconds = timeMs/1000;

    return (seconds < 1 && timeMs + 'ms') ||
      (seconds > 1 && seconds < 60 && (seconds + 's')) ||
      (Math.floor(seconds/60) + 'm' + ' ' + Math.floor(seconds%60) + 's' + (includeMs ? (' / ' + timeMs + 'ms') : ''));
  }

  /**
   * Wrap a synchronous function, turning it into an async fn with a callback as
   * the last argument if necessary. `asyncArgCount` is the expected argument
   * count if `fn` is already asynchronous.
   *
   * @param {number} asyncArgCount
   * @param {function} fn
   * @param {object} [context]
   */
  static makeFnAsync(asyncArgCount, fn, context) {
    if (fn.length === asyncArgCount) {
      return fn;
    }

    return function(...args) {
      let done = args.pop();
      context = context || null;
      fn.apply(context, args);
      done();
    };
  }

  static checkFunction(name, parent) {
    return parent && (typeof parent[name] == 'function') && parent[name] || false;
  }

  static getTestSuiteName(moduleName) {
    let words;

    moduleName = moduleName.replace(testSuiteNameRegxp, function(match, $0, $1, offset, string) {
      if (!match) {
        return '';
      }

      return (offset > 0 && (string.charAt(offset-1) !== ' ') ? ' ':'') + $1;
    });

    words = moduleName.split(nameSeparatorRegxp).map(function(word, index, matches) {
      if (word === '/') {
        return '/';
      }

      return word.charAt(0).toUpperCase() + word.substr(1);
    });

    return words.join('');
  }

  /**
   * A smaller version of util.format that doesn't support json and
   * if a placeholder is missing, it is omitted instead of appended
   *
   * @param f
   * @returns {string}
   */
  static format(f) {
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
  }

  static processAsyncQueue(concurrency, items, fn) {
    let maxWorkers = Math.min(concurrency, items.length);
    let queue = items.slice(0);
    let workers = 0;
    let index = 0;
    let finished = false;

    const isQueueEmpty = function(queue) {
      return queue.reduce(function(prev, val) {
        if (val) {
          prev++;
        }

        return prev;
      }, 0) === 0;
    };

    const next = function(done = function() {}, currentIndex) {
      queue[currentIndex] = null;

      if (isQueueEmpty(queue)) {
        done();
        finished = true;
      } else if (!finished) {
        workers -= 1;
        process();
      }
    };

    const process = function(done) {
      while (workers < maxWorkers) {
        workers += 1;

        if (queue[index]) {
          let item = queue[index];
          fn(item, index, function(idx) {
            next(done, idx);
          });
          index++;
        }

      }
    };

    return new Promise(function(resolve, reject) {
      process(function() {
        resolve();
      });
    });
  }

  static getModuleKey(filePath, srcFolders, fullPaths) {
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
  }

  static showStackTraceWithHeadline(headline, stack, isErr) {
    let logMethod = isErr ? 'error' : 'log';
    let stackTrace;
    console[logMethod](Logger.colors.red(headline));

    if (Array.isArray(stack) && stack.length > 0) {
      stackTrace = Utils.stackTraceFilter(stack);
    } else {
      stackTrace = stack;
    }

    if (stack) {
      console[logMethod](Logger.colors.stack_trace(stackTrace));
    }
  }

  static stackTraceFilter(parts) {
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
  }

  /**
   * @param {Error} err
   */
  static errorToStackTrace(err) {
    if (!Utils.isErrorObject(err)) {
      err = new Error(err);
    }

    const colors = require('./logger.js').colors;
    let headline = err.message || err.name;
    if (err.detailedErr) {
      headline += `\n ${err.detailedErr}`;
    }

    headline = colors.red(headline.replace(indentRegex, '  '));

    let stackTrace = err.stack.split('\n').slice(1);
    stackTrace = Utils.stackTraceFilter(stackTrace);
    stackTrace = colors.stack_trace(stackTrace.replace(indentRegex, '   '));

    return `${headline}\n${stackTrace}`;
  }

  static showStackTrace(stack) {
    let parts = stack.split('\n');
    let headline = parts.shift();

    const colors = require('./logger.js').colors;
    console.error(colors.red(headline.replace(indentRegex, '   ')));
    if (parts.length > 0) {
      let result = Utils.stackTraceFilter(parts);
      console.error(colors.stack_trace(result.replace(indentRegex, '   ')));
    }
  }

  static isErrorObject(err) {
    return err instanceof Error || Object.prototype.toString.call(err) === '[object Error]';
  }

  // util to replace deprecated fs.existsSync
  static dirExistsSync (path) {
    try {
      return fs.statSync(path).isDirectory(); // eslint-disable-next-line no-empty
    } catch (e) {}

    return false;
  }

  static fileExistsSync (path) {
    try {
      return fs.statSync(path).isFile(); // eslint-disable-next-line no-empty
    } catch (e) {}

    return false;
  }

  static fileExists(path) {
    return Utils.checkPath(path)
      .then(function(stats) {
        return stats.isFile();
      })
      .catch(function(err) {
        return false;
      });
  }

  static isFileNameValid(fileName) {
    return path.extname(fileName) === '.js';
  }

  static checkPath(source) {
    return new Promise(function(resolve, reject) {
      fs.stat(source, function(err, stat) {
        if (err) {
          return reject(err);
        }

        resolve(stat);
      });
    });
  }

  static getConfigFolder(argv) {
    if (!argv || !argv.config) {
      return '';
    }

    return path.dirname(argv.config);
  }
}

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

module.exports = Utils;