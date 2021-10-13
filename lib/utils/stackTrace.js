const {colors} = require('./colors.js');
const isErrorObject = require('./isErrorObject.js');
const addDetailedError = require('./addDetailedError.js');
const indentRegex = /^/gm;

const stackTraceFilter = function (parts) {
  let stack = parts.reduce(function(list, line) {
    if (contains(line, [
      'node_modules',
      '(node.js:',
      '(timers.js:',
      '(events.js:',
      '(util.js:',
      '(net.js:',
      '(internal/process/',
      'internal/timers.js',
      '_http_client.js:',
      'process._tickCallback'
    ])) {
      return list;
    }

    list.push(line);

    return list;
  }, []);

  return stack.join('\n');
};

const contains = function(str, text) {
  if (Array.isArray(text)) {
    for (let i = 0; i < text.length; i++) {
      if (contains(str, text[i])) {
        return true;
      }
    }
  }

  return str.includes(text);
};

const filterStack = function(err) {
  if (err instanceof Error) {
    const stackTrace = err.stack.split('\n').slice(1);

    return stackTraceFilter(stackTrace);
  }

  return '';
};

const filterStackTrace = function(stackTrace = '') {
  const sections = stackTrace.split('\n');

  return stackTraceFilter(sections);
};

const showStackTrace = function (stack) {
  let parts = stack.split('\n');
  let headline = parts.shift();

  console.error(colors.red(headline.replace(indentRegex, '   ')));

  if (parts.length > 0) {
    let result = stackTraceFilter(parts);
    console.error(colors.stack_trace(result.replace(indentRegex, '   ')));
  }
};

/**
 * @method errorToStackTrace
 * @param {Error} err
 */
const errorToStackTrace = function(err) {
  if (!isErrorObject(err)) {
    err = new Error(err);
  }

  addDetailedError(err);

  let headline = err.message ? `${err.name}: ${err.message}` : err.name;
  if (err.detailedErr) {
    headline += `\n ${err.detailedErr}`;
  }

  headline = colors.red(headline.replace(indentRegex, '  '));

  const showStack = err.showTrace || err.showTrace === undefined;
  let stackTrace = '';
  if (showStack) {
    stackTrace = filterStack(err);
    stackTrace = '\n' + colors.stack_trace(stackTrace.replace(indentRegex, '   '));
  }

  return `${headline}${stackTrace}`;
};

module.exports = {
  errorToStackTrace,
  stackTraceFilter,
  filterStack,
  filterStackTrace,
  showStackTrace
};