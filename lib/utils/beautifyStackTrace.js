const fs = require('fs');
const stackTraceParser = require('stacktrace-parser');
const AssertionError = require('assertion-error');
const {filterStackTrace} = require('./stackTrace.js');
const alwaysDisplayError = require('./alwaysDisplayError.js');
const {colors} = require('./colors.js');

/**
 * Read the User file from the stackTrace and create a string with highlighting the line with error
 * @param {Error} err
 */ 
function beautifyStackTrace(err, errStackPassed = false, modulepath) {
  if ((err instanceof AssertionError) || alwaysDisplayError(err) || errStackPassed) {
    try {
      const errorStack = errStackPassed ? err : err.stack;

      const parsedStacks = stackTraceParser.parse(filterStackTrace(errorStack));
      const parsedStack = modulepath ? parsedStacks.find(o => o.file === modulepath) : parsedStacks[0];

      const file = fs.readFileSync(parsedStack.file, 'utf-8');
      const errorLinesofFile = file.split(/\r?\n/);
      
      const desiredLines = errorLinesofFile.reduce(function(lines, newLine, lineIndex) {
        const currentLine = lineIndex + 1;
        if (currentLine === parsedStack.lineNumber) {
          lines += '\n    ' + colors.light_gray(` ${currentLine} | ${newLine} `, colors.background.red);
        } else if (currentLine <= (parsedStack.lineNumber + 2) && currentLine >= (parsedStack.lineNumber - 2)) {
          lines += `\n     ${currentLine} | ${newLine}`;
        }
    
        return lines;
      }, '');

      let delimiter = (new Array(parsedStack.file.length + 3).join('–'));

      return '    '  + parsedStack.file + ':\n    ' + delimiter + desiredLines + '\n    ' + delimiter + '\n';
    } catch (err) {
      return '';
    }
  }

  return '';
}

module.exports = beautifyStackTrace;

