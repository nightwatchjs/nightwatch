const stackTraceParser = require('stacktrace-parser'); 

const {filterStackTrace} = require('./stackTrace');
const {colors} = require('./colors.js');

/**
 * Read the User file from the stackTrace and forms 
 * string with highlighting the line with error.
 */ 
function beautifyStackTrace(err) {
  if (err) {
    const parsedStack = stackTraceParser.parse(filterStackTrace(err.stack))[0];
    let lines = require('fs').readFileSync(parsedStack.file, 'utf-8').split(/\r?\n/).reduce(function(lines, newLine, lineIndex) {
      const currentLine = lineIndex + 1;
      if (currentLine === parsedStack.lineNumber) {
        lines += colors.cyan(`\t${currentLine} ${newLine}\n`);
      } else if (currentLine <= (parsedStack.lineNumber + 2) && currentLine >= (parsedStack.lineNumber - 2)) {
        lines += `\t${currentLine} ${newLine}\n`;
      }
  
      return lines;
    }, '');
    lines += '\n';
  
    return lines;
  }
}

module.exports = beautifyStackTrace;

