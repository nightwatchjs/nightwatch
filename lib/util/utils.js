var Util = module.exports = {};

Util.formatElapsedTime = function(timeMs) {
  var seconds = timeMs/1000;
  return (seconds < 1 && timeMs + 'ms') ||
    (seconds > 1 && seconds < 60 && (seconds + 's')) ||
    (Math.floor(seconds/60) + 'm' + ' ' + Math.floor(seconds%60) + 's' + ' / ' + timeMs + 'ms');
};

/**
 * Wrap a synchronous function, turning it into an async fn with a callback as
 * the last argument if necessary. `asyncArgCount` is the expected argument
 * count if `fn` is already asynchronous.
 *
 * @param {number} asyncArgCount
 * @param {function} fn
 */
Util.makeFnAsync = function (asyncArgCount, fn) {
  if (fn.length === asyncArgCount) {
    return fn;
  }
  function asyncFn() {
    var args = Array.prototype.slice.call(arguments, 0);
    var done = args.pop();
    fn.apply(null, args);
    done();
  }
  return asyncFn;
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

  words = moduleName.split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  return words.join(' ');
};
