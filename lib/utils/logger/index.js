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

// 26 Feb 16:19:34
function timestamp(format) {
  let d = new Date();

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

function logTimestamp() {
  if (LogSettings.isLogTimestamp()) {
    return colors.white(timestamp(LogSettings.timestampFormat));
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
  let timestamp = logTimestamp();

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

function logError(severity, errOrMessage, args) {
  if (isErrorObject(errOrMessage)) {
    errOrMessage = errorToStackTrace(errOrMessage);
  }

  const alwaysDisplay = LogSettings.isErrorLogEnabled() && severity === Severity.ERROR;

  logMessage(severity, errOrMessage, args, alwaysDisplay);
}

module.exports = new (function() {

  class Logger {
    constructor() {
      this.colors = colors;
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

    underline(text) {
      if (!this.colors) {
        return text;
      }

      return '\u{1b}[4m' + text + '\u{1b}[24m';
    }

    setOptions(settings) {
      this.setOutputEnabled(settings.output);
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

  return new Logger();
});
