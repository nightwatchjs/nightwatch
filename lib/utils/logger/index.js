const util = require('util');
const LogSettings = require('./log_settings.js');
const {colors, colorsEnabled, disableColors} = require('../colors.js');

const isErrorObject = require('../isErrorObject.js');
const {errorToStackTrace} = require('../stackTrace.js');

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

  let time = [
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
    colors: colorsEnabled
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
    return colors.white(timestamp(d, LogSettings.timestampFormat));
  }

  return '';
}

function logMessage(type, message, args, alwaysShow) {
  if (!message || !LogSettings.outputEnabled || !LogSettings.enabled && !alwaysShow) {
    return;
  }

  let messageStr = '';
  let logMethod = 'log';
  let prefix;
  let d = new Date();
  let timeIso = d.toISOString();
  let timestamp = logTimestamp(d);

  switch (type) {
    case Severity.ERROR:
      prefix = colors.yellow(type, colors.background.black);
      messageStr = colors.light_red(message);
      logMethod = 'error';
      break;

    case Severity.INFO:
      prefix = colors.light_purple(type, colors.background.black);
      messageStr = colors.light_cyan(message);
      break;

    case Severity.LOG:
      prefix = colors.white(type + ' ', colors.background.black);
      messageStr = colors.white(message);
      break;

    case Severity.WARN:
      prefix = colors.light_green(type, colors.background.black);
      messageStr = colors.light_green(message);
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

function logRequest(message, params) {
  if (!message || !LogSettings.htmlReporterEnabled) {
    return;
  }

  const d = new Date();
  const timeIso = d.toISOString();
  const instance = Logger.getInstance();

  instance.output.push([timeIso, message, inspectObject(params)]);
}

function logError(severity, errOrMessage, args) {
  if (isErrorObject(errOrMessage)) {
    errOrMessage = errorToStackTrace(errOrMessage);
  }

  const alwaysDisplay = LogSettings.isErrorLogEnabled() && severity === Severity.ERROR;

  logMessage(severity, errOrMessage, args, alwaysDisplay);
}

class Logger {
  static getInstance() {
    return __instance__;
  }

  constructor() {
    this.colors = colors;
    this.output = [];
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
    logError('WARN', message, args);
  }

  error(message, ...args) {
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
    disableColors();
    this.colors = colors;
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

  formatMessage(msg, ...args) {
    args = args.map(val => {
      return colors.brown(val);
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
