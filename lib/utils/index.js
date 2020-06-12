const path = require('path');
const fs = require('fs');
const mkpath = require('mkpath');

const BrowserName = require('./browsername.js');
const LocateStrategy = require('./locatestrategy.js');
const Logger = require('./logger.js');
const PeriodicPromise = require('./periodic-promise.js');
const createPromise = require('./createPromise.js');
const Screenshots = require('./screenshots.js');
const TimedCallback = require('./timed-callback.js');

const formatRegExp = /%[sdj%]/g;
const indentRegex = /^/gm;
const testSuiteNameRegxp = /(_|-|\.)*([A-Z]*)/g;
const nameSeparatorRegxp = /(\s|\/)/;

const PrimitiveTypes = {
  OBJECT: 'object',
  FUNCTION: 'function',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  STRING: 'string',
  UNDEFINED: 'undefined'
};

class Utils {
  static isObject(obj) {
    return obj !== null && typeof obj == 'object';
  }

  static isFunction(fn) {
    return typeof fn == PrimitiveTypes.FUNCTION;
  }

  static isBoolean(value) {
    return typeof value == PrimitiveTypes.BOOLEAN;
  }

  static isNumber(value) {
    return typeof value == PrimitiveTypes.NUMBER;
  }

  static isString(value) {
    return typeof value == PrimitiveTypes.STRING;
  }

  static isUndefined(value) {
    return typeof value == PrimitiveTypes.UNDEFINED;
  }

  static isES6AsyncFn(fn) {
    return Utils.isFunction(fn) && fn.constructor.name === 'AsyncFunction';
  }

  static enforceType(value, type) {
    type = type.toLowerCase();

    switch (type) {
      case PrimitiveTypes.STRING:
      case PrimitiveTypes.BOOLEAN:
      case PrimitiveTypes.NUMBER:
      case PrimitiveTypes.FUNCTION:
        if (typeof value != type) {
          throw new Error(`Invalid type ${typeof value} for value "${value}". Expecting "${type}" instead.`);
        }

        return;
    }

    throw new Error(`Invalid type ${type} for ${value}`);
  }

  static convertBoolean(value) {
    if (Utils.isString(value) && (!value || value === 'false' || value === '0')) {
      return false;
    }

    return Boolean(value);
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

  static makePromise(handler, context, args) {
    const result = Reflect.apply(handler, context, args);
    if (result instanceof Promise) {
      return result;
    }

    return Promise.resolve(result);
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

  static stackTraceFilter(parts) {
    let stack = parts.reduce(function(list, line) {
      if (contains(line, [
        'node_modules',
        '(node.js:',
        '(timers.js:',
        '(events.js:',
        '(util.js:',
        '(net.js:',
        'process._tickCallback'
      ])) {
        return list;
      }

      list.push(line);

      return list;
    }, []);

    return stack.join('\n');
  }

  static addDetailedError(err) {
    let detailedErr;

    if (err instanceof TypeError) {
      if (/\.page\..+ is not a function$/.test(err.message)) {
        detailedErr = '- verify if page objects are setup correctly, check "page_objects_path" in your config';
      } else if (/\w is not a function$/.test(err.message)) {
        detailedErr = '- writing an ES6 async test case? - keep in mind that commands return a Promise; \n - writing unit tests? - make sure to specify "unit_tests_mode=true" in your config.';
      }
    }

    if (detailedErr) {
      err.detailedErr = detailedErr;
    }
  }

  /**
   * @param {Error} err
   */
  static errorToStackTrace(err) {
    if (!Utils.isErrorObject(err)) {
      err = new Error(err);
    }

    Utils.addDetailedError(err);

    const colors = require('./logger.js').colors;
    let headline = err.message ? `${err.name}: ${err.message}` : err.name;
    if (err.detailedErr) {
      headline += `\n ${err.detailedErr}`;
    }

    headline = colors.red(headline.replace(indentRegex, '  '));

    let stackTrace = Utils.filterStack(err);
    stackTrace = colors.stack_trace(stackTrace.replace(indentRegex, '   '));

    return `${headline}\n${stackTrace}`;
  }

  static filterStack(err) {
    if (err instanceof Error) {
      const stackTrace = err.stack.split('\n').slice(1);

      return Utils.stackTraceFilter(stackTrace);
    }

    return '';
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
  static dirExistsSync(path) {
    try {
      return fs.statSync(path).isDirectory(); // eslint-disable-next-line no-empty
    } catch (e) {}

    return false;
  }

  static fileExistsSync(path) {
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

  static checkPath(source, originalErr = null, followSymlinks = true) {
    return new Promise(function(resolve, reject) {
      fs[followSymlinks ? 'stat' : 'lstat'](source, function(err, stats) {
        if (err) {
          return reject(err.code === 'ENOENT' && originalErr || err);
        }

        resolve(stats);
      });
    });
  }

  /**
   * @param {string} source
   * @return {Promise}
   */
  static isFolder(source) {
    return Utils.checkPath(source, null, false).then(stats => stats.isDirectory());
  }

  /**
   * @param {string} source
   * @return {Promise}
   */
  static readDir(source) {
    return new Promise(function(resolve, reject) {
      fs.readdir(source, function(err, list) {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  }

  /**
   *
   * @param {string} sourcePath
   * @param {Array} namespace
   * @param {function} loadFn
   */
  static readFolderRecursively(sourcePath, namespace = [], loadFn) {
    const resources = fs.readdirSync(sourcePath);

    resources.forEach(resource => {
      const isFolder = fs.lstatSync(path.join(sourcePath, resource)).isDirectory();

      if (isFolder) {
        const pathFolder = path.join(sourcePath, resource);
        let ns = namespace.slice(0);
        ns.push(resource);
        Utils.readFolderRecursively(pathFolder, ns, loadFn);

        return;
      }

      loadFn(sourcePath, resource, namespace);
    });
  }

  static getConfigFolder(argv) {
    if (!argv || !argv.config) {
      return '';
    }

    return path.dirname(argv.config);
  }

  /**
   *
   * @param {Array} arr
   * @param {number} maxDepth
   * @param {Boolean} includeEmpty
   * @returns {Array}
   */
  static flattenArrayDeep(arr, maxDepth = 4, includeEmpty = false) {
    if (!Array.isArray(arr)) {
      throw new Error(`Utils.flattenArrayDeep excepts an array to be passed. Received: "${arr === null ? arr : typeof arr}".`);
    }

    return (function flatten(currentArray, currentDepth, initialValue = []) {
      currentDepth = currentDepth + 1;

      return currentArray.reduce(function(prev, value) {
        if (Array.isArray(value)) {
          let result = prev.concat(value);
          if (Array.isArray(result) && currentDepth <= maxDepth) {
            return flatten(result, currentDepth);
          }

          return result;
        }

        currentDepth = 0;

        if (!includeEmpty && (value === null || value === undefined || value === '')) {
          return prev;
        }

        prev.push(value);

        return prev;
      }, initialValue);
    })(arr, 0);
  }

  /**
   * Strips out all control characters from a string
   * However, excludes newline and carriage return
   *
   * @param {string} input String to remove invisible chars from
   * @returns {string} Initial input string but without invisible chars
   */
  static stripControlChars(input) {
    return input && input.replace(
      // eslint-disable-next-line no-control-regex
      /[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g,
      ''
    );
  }

  static relativeUrl(url) {
    return !(url.includes('://'));
  }

  static uriJoin(baseUrl, uriPath) {
    let result = baseUrl;

    if (baseUrl.endsWith('/')) {
      result = result.substring(0, result.length - 1);
    }

    if (!uriPath.startsWith('/')) {
      result = result + '/';
    }

    return result + uriPath;
  }

  static replaceParams(url, params = {}) {
    return Object.keys(params).reduce(function(prev, param) {
      prev = prev.replace(`:${param}`, params[param]);

      return prev;
    }, url);
  }

  static createFolder(dirPath) {
    return new Promise((resolve, reject) => {
      mkpath(dirPath, function(err) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  static containsMultiple(arrayOrString, valueToFind, separator = ',') {
    if (typeof valueToFind == 'string') {
      valueToFind = valueToFind.split(separator);
    }

    if (Array.isArray(valueToFind)) {
      if (valueToFind.length > 1) {
        return valueToFind.every(item => arrayOrString.includes(item));
      }

      valueToFind = valueToFind[0];
    }

    return arrayOrString.includes(valueToFind);
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

  return str.includes(text);
}

module.exports = Utils;
module.exports.PrimitiveTypes = PrimitiveTypes;
module.exports.BrowserName = BrowserName;
module.exports.LocateStrategy = LocateStrategy;
module.exports.Logger = Logger;
module.exports.createPromise = createPromise;
module.exports.PeriodicPromise = PeriodicPromise;
module.exports.Screenshots = Screenshots;
module.exports.TimedCallback = TimedCallback;
