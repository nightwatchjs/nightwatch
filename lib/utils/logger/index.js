const util = require('util');
const boxen = require('boxen');
const didYouMean = require('didyoumean');
const AssertionError = require('assertion-error');
const lodashEscape = require('lodash/escape');

const LogSettings = require('./log_settings.js');
const chalkColors = require('../chalkColors.js');

const addDetailedError = require('../addDetailedError.js');

const Errors = require('../../transport/errors');
const beautifyStackTrace = require('../beautifyStackTrace.js');

const alwaysDisplayError = require('../alwaysDisplayError.js');

const Severity = {
  LOG: 'LOG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

let __instance__;

// 26 Feb 16:19:34
function timestamp(d = new Date(), format) {
  if (format === 'iso') {
    return d.toISOString();
  }

  const time = [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(':');

  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

function inspectObject(obj) {
  return util.inspect(obj, {
    showHidden: false,
    depth: 4,
    colors: chalkColors.colorsEnabled
  })
    .replace(/^\s{2}/gm, '     ')
    .replace(/^}$/m, '  }');
}

function logObject(obj) {
  // eslint-disable-next-line no-console
  console.log('  ', inspectObject(obj));
}

function logTimestamp(d) {
  if (LogSettings.isLogTimestamp()) {
    return chalkColors.colors.white.bold(timestamp(d, LogSettings.timestampFormat));
  }

  return '';
}

function logMessage(type, message, args, alwaysShow) {
  if (!message || !LogSettings.outputEnabled || !LogSettings.enabled && !alwaysShow) {
    return;
  }

  const colors = chalkColors.colors;
  let messageStr = '';
  let logMethod = 'log';
  let prefix;
  const d = new Date();
  const timeIso = d.toISOString();
  let timestamp = logTimestamp(d);

  switch (type) {
    case Severity.ERROR:
      prefix = colors.bgBlack.yellow.bold(type);
      // eslint-disable-next-line no-control-regex
      messageStr = message.match(/\u001b\[.*?m/) ? message : colors.red.bold(message);
      logMethod = 'error';
      break;

    case Severity.INFO:
      prefix = colors.bgBlack.magenta.bold(type);
      // eslint-disable-next-line no-control-regex
      messageStr = message.match(/\u001b\[.*?m/) ? message : colors.cyan.bold(message);
      break;

    case Severity.LOG:
      prefix = colors.bgBlack.white.bold(type + ' ');
      // eslint-disable-next-line no-control-regex
      messageStr = message.match(/\u001b\[.*?m/) ? message : colors.white.bold(message);
      break;

    case Severity.WARN:
      prefix = colors.bgBlack.green.bold(type);
      // eslint-disable-next-line no-control-regex
      messageStr = message.match(/\u001b\[.*?m/) ? message : colors.green.bold(message);
      logMethod = 'warn';
      break;
  }

  if (LogSettings.timestampFormat === 'iso') {
    let severity = type.toUpperCase();
    if (severity === Severity.LOG) {
      severity = Severity.INFO;
    }

    timestamp += ` ${severity} nightwatch:`;
  }

  // eslint-disable-next-line no-console
  console[logMethod](timestamp, messageStr);

  if (args.length > 0) {
    let inlineArgs = [];
    args.forEach(function(item) {
      if (item === undefined) {
        return;
      }

      if (Object.prototype.toString.call(item) === '[object Object]' && Object.keys(item).length > 0) {
        if (inlineArgs.length) {
          // eslint-disable-next-line no-console
          console[logMethod](...inlineArgs);
          inlineArgs = [];
        }
        logObject(item);
      } else {
        inlineArgs.push(item);
      }
    });

    if (inlineArgs.length) {
      // eslint-disable-next-line no-console
      console[logMethod](...inlineArgs);
      inlineArgs = [];
    }
  }
}

function findSuggestion({message} = {}) {
  if (message && message.includes('is not a function')) {
    const match = message.replace(' is not a function', '').replace('browser.', '');

    if (match) {
      const suggestion = didYouMean(match, ['element.findAll']);
      if (suggestion) {
        return suggestion;
      }
    }
  }

  return null;
}

function logRequest(message, params) {
  if (!message || !LogSettings.htmlReporterEnabled) {
    return;
  }

  const d = new Date();
  const timeIso = d.toISOString();
  const instance = Logger.getInstance();

  instance.output.push([timeIso, lodashEscape(message), lodashEscape(inspectObject(params))]);
  instance.commandOutput.push([timeIso, lodashEscape(message), lodashEscape(inspectObject(params))]);
  instance.testSectionOutput.push([timeIso, lodashEscape(message), lodashEscape(inspectObject(params))]);
  instance.testHooksOutput.push([timeIso, lodashEscape(message), lodashEscape(inspectObject(params))]);
}

function logError(severity, errOrMessage, args) {
  const alwaysDisplay = LogSettings.isErrorLogEnabled() && severity === Severity.ERROR;
  logMessage(severity, errOrMessage, args, alwaysDisplay);
}

class Logger {
  static getInstance() {
    return __instance__;
  }

  constructor() {
    this.colors = chalkColors.colors;

    this.output = [];
    this.commandOutput = [];
    this.testSectionOutput = [];
    this.testHooksOutput = [];
  }

  logMessage(...args) {
    logMessage(...args);
  }

  inspectObject(obj) {
    return inspectObject(obj);
  }

  info(message, ...args) {
    logMessage('INFO', message, args);
  }

  log(message, ...args) {
    logMessage('LOG', message, args);
  }

  warn(message, ...args) {
    message = this.getErrorContent(message);
    logError('WARN', message, args);
  }

  error(message, ...args) {
    message = this.getErrorContent(message);
    logError('ERROR', message, args);
  }

  request(message, params) {
    logRequest(message, params);
  }

  response(message, params) {
    logRequest(message, params);
  }

  underline(text) {
    if (!this.colors) {
      return text;
    }

    return '\u{1b}[4m' + text + '\u{1b}[24m';
  }

  setOptions(settings) {
    this.setOutputEnabled(settings.output);
    this.setHtmlReporterEnabled(typeof settings.output_folder == 'string');
    this.setDetailedOutput(settings.detailed_output);
    this.setLogTimestamp(settings.output_timestamp, settings.timestamp_format);
    this.setErrorLog(settings.disable_error_log);

    if (settings.disable_colors) {
      this.disableColors();
    }

    if (settings.silent) {
      this.disable();
    } else {
      this.enable();
    }
  }

  disableColors() {
    chalkColors.disable();
  }

  setHtmlReporterEnabled(value) {
    LogSettings.htmlReporterEnabled = value;
  }

  disable() {
    LogSettings.disable();
  }

  enable() {
    LogSettings.enable();
  }

  setOutputEnabled(val = true) {
    LogSettings.outputEnabled = val;
  }

  isOutputEnabled() {
    return LogSettings.outputEnabled;
  }

  isHtmlReporterEnabled() {
    return LogSettings.htmlReporterEnabled;
  }

  setDetailedOutput(val) {
    LogSettings.detailedOutput = val;
  }

  isDetailedOutput() {
    return LogSettings.outputEnabled && LogSettings.detailedOutput;
  }

  setLogTimestamp(val, format) {
    LogSettings.setLogTimestamp(val, format);
  }

  setHttpLogOptions(opts) {
    LogSettings.setHttpLogOptions(opts);
  }

  showRequestData() {
    return LogSettings.showRequestData;
  }

  showResponseHeaders() {
    return LogSettings.showResponseHeaders;
  }

  isLogTimestamp() {
    return LogSettings.isLogTimestamp();
  }

  isErrorLogEnabled() {
    return LogSettings.isErrorLogEnabled();
  }

  isEnabled() {
    return LogSettings.enabled;
  }

  setErrorLog(val = false) {
    LogSettings.disableErrorLog = val;
  }

  logDetailedMessage(message, type = 'log') {
    if (!LogSettings.outputEnabled || !LogSettings.detailedOutput) {
      return;
    }

    // eslint-disable-next-line no-console
    console[type](message);
  }

  getFailedAssertions(assertions, modulepath) {
    return assertions.reduce((prev, a) => {
      if (a.failure !== false) {
        prev.push(`   ${this.colors.red.bold('→') + this.getErrorContent(a, modulepath)}`);
      }

      return prev;
    }, []).join('\n');
  }

  isAssertionError(err) {
    return (err instanceof AssertionError) || err.name === 'AssertionError' || err.name === 'NightwatchAssertError' || err.name === 'NightwatchMountError';
  }

  getErrorContent(error, modulepath) {
    let errorObj;
    if (this.isAssertionError(error)) {
      errorObj = error;
    } else {
      errorObj = Errors.getErrorObject(error);
    }

    addDetailedError(errorObj, modulepath);

    const content = [];

    let errorTitle = ` ${this.colors.light_red(errorObj.name)}`;
    if (this.isAssertionError(error) || alwaysDisplayError(error)) {
      errorTitle = ` ${this.colors.red.bold('✖') + errorTitle}`;
    }

    const message = [];
    if (errorObj.message || errorObj.fullMsg) {
      let errorObjMessage = errorObj.message;
      // eslint-disable-next-line no-control-regex
      errorObjMessage = errorObjMessage.match(/\u001b\[.*?m/) ? errorObjMessage : this.colors.red(errorObjMessage);
      message.push(errorObjMessage);

      if (errorObj.detailedErr) {
        message.push(this.colors.light_green(errorObj.detailedErr));

        if (errorObj.extraDetail) {
          message.push(this.colors.light_green(errorObj.extraDetail));
        }
      }
    }

    content.push(errorTitle);
    const showStack = errorObj.showTrace || errorObj.showTrace === undefined;

    if (!showStack && errorObj.reportShown) {
      return ' ' + message.join('\n ');
    }

    if (!showStack && !this.isAssertionError(error) && !error.help) {
      return '\n' + boxen(`${message.join('\n')}\n`, {padding: 1, borderColor: 'red'}) + '\n';
    }

    const messageStr = message.join('\n    ');
    content.push(`   ${messageStr}`);

    const suggestion = findSuggestion(error);
    if (suggestion) {
      errorObj.help = errorObj.help || [];
      errorObj.help.unshift(' did you mean: ' + suggestion + '?');
    }

    if (errorObj.help) {
      content.push(this.colors.brown('\n    Try fixing by :'));
      errorObj.help.forEach((step, index) => {
        content.push(`    ${this.colors.blue(index + 1)}. ${step}`);
      });
    }

    if (errorObj.link){
      content.push(`\n    ${this.colors.brown('Read More')} : \n    ${this.colors.cyan(errorObj.link)} `);
    }

    let stack = error.stack || error.stackTrace;
    if (stack && showStack) {
      stack = '    at' + stack.split(/ {4}at/g).slice(1).join('    at');

      const beautified = beautifyStackTrace(stack, true, modulepath);
      if (beautified) {
        content.push(this.colors.brown('\n    Error location:'));
        content.push(beautified);
      }

      if (alwaysDisplayError(errorObj)) {
        content.push(this.colors.brown('    Stack Trace :'));
        const coloredStack = stack.split('\n').map((line) => this.colors.stack_trace(line)).join('\n');
        content.push(`${coloredStack}\n`);
      }
    }

    if (content.length === 2) {
      if (content[0].includes('WebDriverError')) {
        return content.join(this.colors.light_red(':'));
      }

      if (content[0].includes('Error') && content[1].includes('Error while')) {
        const firstLine = content.shift();
        content[0] = '  ' + firstLine + content[0];
      }

    }

    return content.join('\n');
  }

  formatMessage(msg, ...args) {
    args = args.map(val => {
      return this.colors.brown(val);
    });

    return util.format(msg, ...args);
  }
}

module.exports = new (function() {
  __instance__ = new Logger();

  return Logger.getInstance();
});

const getOutput = module.exports.getOutput = function() {
  if (!Logger.getInstance()) {
    return [];
  }

  const {output} = Logger.getInstance();

  return output.slice(0);
};

module.exports.collectOutput = function() {
  const instance = Logger.getInstance();

  if (!instance) {
    return [];
  }

  const output = getOutput();
  instance.output = [];

  return output;
};

module.exports.collectTestSectionOutput = function() {
  const instance = Logger.getInstance();

  if (!instance) {
    return [];
  }

  const {testSectionOutput} = instance;
  instance.testSectionOutput = [];

  return testSectionOutput;
};

module.exports.collectCommandOutput = function() {
  const instance = Logger.getInstance();

  if (!instance) {
    return [];
  }

  const {commandOutput} = instance;
  instance.commandOutput = [];

  return commandOutput;
};

module.exports.collectTestHooksOutput = function() {
  const instance = Logger.getInstance();

  if (!instance) {
    return [];
  }

  const {testHooksOutput} = instance;
  instance.testHooksOutput = [];

  return testHooksOutput;
};
module.exports.reset = function() {
  const instance = Logger.getInstance();

  if (!instance) {
    return;
  }

  instance.testSectionOutput = [];
  instance.output = [];
};
