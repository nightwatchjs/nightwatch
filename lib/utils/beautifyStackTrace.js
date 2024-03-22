const fs = require('fs');
const stackTraceParser = require('stacktrace-parser');
const AssertionError = require('assertion-error');
const {filterStackTrace} = require('./stackTrace.js');
const alwaysDisplayError = require('./alwaysDisplayError');
const {colors} = require('./chalkColors.js');

/**
 * Read the User file from the stackTrace and create a string with highlighting the line with error
 * @param {Error} err
 */
function beautifyStackTrace(err, errStackPassed = false, modulepath, cli = true) {
  if ((err instanceof AssertionError) || alwaysDisplayError(err) || errStackPassed) {
    try {
      const errorStack = errStackPassed ? err : err.stack;

      const parsedStacks = stackTraceParser.parse(filterStackTrace(errorStack));
      let parsedStack = modulepath ? parsedStacks.find(o => o.file === modulepath) : parsedStacks[0];

      if (!parsedStack) {
        parsedStack = parsedStacks[0];
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

      return '    '  + parsedStack.file + `:${formattedStack.error_line_number}\n    ` + delimiter + desiredLines + '\n    ' + delimiter + '\n';
    } catch (err) {
      return '';
    }
  }

  return '';
}

/**
 * Read the User file from the stackTrace and create a string with highlighting the line with error
 * @param {Error} err
 */
function formatStackTrace(errorLinesofFile, parsedStack) {

  const result = {
    filePath: parsedStack.file,
    error_line_number: parsedStack.lineNumber,
    codeSnippet: []
  };

  errorLinesofFile.reduce(function(lines, newLine, lineIndex) {
    const currentLine = lineIndex + 1;
    if (currentLine <= (parsedStack.lineNumber + 2) && currentLine >= (parsedStack.lineNumber - 2)) {
      result.codeSnippet.push({
        line_number: currentLine, code: newLine
      });
    }
  }, '');


  return result;

}

module.exports = beautifyStackTrace;

