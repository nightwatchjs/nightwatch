import fs from 'fs';
import stackTraceParser from 'stacktrace-parser';
import AssertionError from 'assertion-error';

import stackTrace = require('./stackTrace');
const {filterStackTrace} = stackTrace;
import alwaysDisplayError = require('./alwaysDisplayError');
import chalkColors = require('./chalkColors');
const {colors} = chalkColors;

function isAssertionError(err: unknown): err is AssertionError {
  return err instanceof AssertionError;
}

/**
 * Read the user file from the stackTrace and create a string with highlighting the line with error.
 */
function beautifyStackTrace(err: string, errStackPassed: true, modulePath: string, cli: false): FormatStackTraceResult;
function beautifyStackTrace(err: string, errStackPassed: true, modulePath: string, cli?: true): string;
function beautifyStackTrace(err: Error, errStackPassed: false, modulePath: string, cli: false): FormatStackTraceResult;
function beautifyStackTrace(err: Error, errStackPassed: false, modulePath: string, cli?: true): string;
function beautifyStackTrace(err: string | Error, errStackPassed = false, modulepath: string, cli = true): string | FormatStackTraceResult {
  let errorStack: string;

  if (isAssertionError(err) || alwaysDisplayError(err)) {
    errorStack = err.stack || '';
  } else if (errStackPassed) {
    errorStack = err as string;
  } else {
    return '';
  }

  try {
    const parsedStacks = stackTraceParser.parse(filterStackTrace(errorStack));
    let parsedStack = modulepath ? parsedStacks.find(o => o.file === modulepath) : parsedStacks[0];

    if (!parsedStack) {
      parsedStack = parsedStacks[0];
    }

    if (parsedStack.file === null) {
      return '';
    }

    const file = fs.readFileSync(parsedStack.file, 'utf-8');
    const errorLinesofFile = file.split(/\r?\n/);

    const formattedStack = formatStackTrace(errorLinesofFile, parsedStack);
    if (!cli) {
      return formattedStack;
    }

    const desiredLines = formattedStack.codeSnippet.reduce(function(lines, newLine) {
      const currentLine = newLine.line_number;
      if (currentLine === formattedStack.error_line_number) {
        lines += '\n    ' + colors.bgRed.white(` ${currentLine} | ${newLine.code} `);
      } else if (currentLine <= (formattedStack.error_line_number + 2) && currentLine >= (formattedStack.error_line_number - 2)) {
        lines += `\n     ${currentLine} | ${newLine.code}`;
      }

      return lines;
    }, '');

    const delimiter = (new Array(parsedStack.file.length + 3).join('–'));

    return '    '  + parsedStack.file + ':\n    ' + delimiter + desiredLines + '\n    ' + delimiter + '\n';
  } catch (err) {
    return '';
  }
}

interface FormatStackTraceResult {
  filePath: string;
  error_line_number: number;
  codeSnippet: {
    line_number: number;
    code: string;
  }[]
}

function formatStackTrace(
  errorLinesofFile: string[],
  parsedStack: stackTraceParser.StackFrame
): FormatStackTraceResult {
  const result: FormatStackTraceResult = {
    filePath: parsedStack.file || '',
    error_line_number: parsedStack.lineNumber || 1,
    codeSnippet: []
  };

  errorLinesofFile.reduce(function(_, newLine, lineIndex) {
    const currentLine = lineIndex + 1;
    if (currentLine <= (result.error_line_number + 2) && currentLine >= (result.error_line_number - 2)) {
      result.codeSnippet.push({
        line_number: currentLine, code: newLine
      });
    }

    return '';
  }, '');

  return result;
}

export = beautifyStackTrace;
