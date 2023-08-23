import boxen from 'boxen';

import chalkColors = require('./chalkColors');
const {colors} = chalkColors;
import isErrorObject = require('./isErrorObject');
import addDetailedError = require('./addDetailedError');
import {NightwatchNodeError} from './types';

const indentRegex = /^/gm;

const stackTraceFilter = function (parts: string[]): string {
  const stack = parts.reduce(function(list: string[], line: string) {
    if (contains(line, [
      'node_modules',
      '(node.js:',
      '(timers.js:',
      '(events.js:',
      '(util.js:',
      '(net.js:',
      '(internal/process/',
      'internal/modules/cjs/loader.js',
      'internal/modules/cjs/helpers.js',
      'internal/timers.js',
      '_http_client.js:',
      'process._tickCallback',
      'node:internal/'
    ])) {
      return list;
    }

    list.push(line);

    return list;
  }, []);

  return stack.join('\n');
};

const contains = function(str: string, text: string | string[]) {
  if (Array.isArray(text)) {
    for (let i = 0; i < text.length; i++) {
      if (contains(str, text[i])) {
        return true;
      }
    }

    return false;
  }

  return str.includes(text);
};

const filterStack = function(err: unknown): string {
  if (err instanceof Error) {
    const stackTrace = err.stack?.split('\n').slice(1) || [];

    return stackTraceFilter(stackTrace);
  }

  return '';
};

const filterStackTrace = function(stackTrace = ''): string {
  const sections = stackTrace.split('\n');

  return stackTraceFilter(sections);
};

const showStackTrace = function (stack: string) {
  const parts = stack.split('\n');
  const headline = parts.shift() || '';

  console.error(colors.red(headline.replace(indentRegex, '   ')));

  if (parts.length > 0) {
    const result = stackTraceFilter(parts);
    console.error(colors.grey(result.replace(indentRegex, '   ')));
  }
};

const errorToStackTrace = function(error: unknown) {
  let err: NightwatchNodeError;

  if (isErrorObject(error)) {
    err = error;
  } else {
    err = new Error(String(error));
  }

  addDetailedError(err);

  let headline = err.message ? `${err.name}: ${err.message}` : err.name;
  headline = colors.red(headline.replace(indentRegex, ' '));

  if (err.detailedErr) {
    headline += `\n ${colors.green.bold(err.detailedErr)}`;
    if (err.extraDetail) {
      headline += `\n ${colors.green.bold(err.extraDetail)}`;
    }
  }

  const showStack = err.showTrace || err.showTrace === undefined;
  let stackTrace = '';

  if (!showStack && err.reportShown) {
    return ' ' + headline;
  }

  if (!showStack) {
    return '\n' + boxen(`${headline}\n`, {padding: 1, borderColor: 'red'}) + '\n';
  }

  stackTrace = filterStack(err);
  stackTrace = '\n' + colors.grey(stackTrace.replace(indentRegex, '   '));

  return `${headline}${stackTrace}`;
};

export = {
  errorToStackTrace,
  stackTraceFilter,
  filterStack,
  filterStackTrace,
  showStackTrace
};
