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
function beautifyStackTrace(err) {
  if ((err instanceof AssertionError) || alwaysDisplayError(err)) {
    try {
      const parsedStack = stackTraceParser.parse(filterStackTrace(err.stack))[0];

      let lines = fs.readFileSync(parsedStack.file, 'utf-8').split(/\r?\n/).reduce(function(lines, newLine, lineIndex) {
        const currentLine = lineIndex + 1;
        if (currentLine === parsedStack.lineNumber) {
          lines += '\n ' + colors.light_gray(` ${currentLine} | ${newLine} `, colors.background.black);
        } else if (currentLine <= (parsedStack.lineNumber + 2) && currentLine >= (parsedStack.lineNumber - 2)) {
          lines += `\n  ${currentLine} | ${newLine}`;
        }
    
        return lines;
      }, '');

      let delimiter = (new Array(parsedStack.file.length + 3).join('–'));

      return ' '  + parsedStack.file + ':\n ' + delimiter + lines + '\n ' + delimiter + '\n';
    } catch (err) {
      return '';
    }
  }

  return '';
}

module.exports = beautifyStackTrace;

