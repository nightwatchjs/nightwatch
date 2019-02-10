const util = require('util');

const Settings = {
  outputEnabled: true,
  detailedOutput: true,
  log_timestamp : false,
  colors : true,
  enabled : true
};

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
function timestamp() {
  let d = new Date();
  let time = [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(':');

  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

function Background() {
  return this;
}

function ConsoleColor() {
  this.background = new Background();

  const foregroundColors = {
    black: '0;30',
    dark_gray: '1;30',
    blue: '0;34',
    light_blue: '1;34',
    green: '0;32',
    light_green: '1;32',
    cyan: '0;36',
    light_cyan: '1;36',
    red: '0;31',
    light_red: '1;31',
    purple: '0;35',
    light_purple: '1;35',
    brown: '0;33',
    yellow: '1;33',
    light_gray: '0;37',
    white: '1;37',
    stack_trace: '0;90'
  };

  const backgroundColors = {
    black: '40',
    red: '41',
    green: '42',
    yellow: '43',
    blue: '44',
    magenta: '45',
    cyan: '46',
    light_gray: '47'
  };

  Object.keys(foregroundColors).forEach(k => {
    ConsoleColor.prototype[k.toLowerCase()] = (text, background) => {
      let string = `\u{1b}[${foregroundColors[k.toLowerCase()]}m`;
      if (background !== undefined) {
        string += background();
      }

      string += `${text}\u{1b}[0m`;

      return string;
    };
  });

  Object.keys(backgroundColors).forEach(k => {
    Background.prototype[k.toLowerCase()] = (text) => {
      return `\u{1b}[${backgroundColors[k.toLowerCase()]}m`;
    };
  });

  return this;
}

function logObject(obj) {
  console.log('  ', util.inspect(obj, {
    showHidden : false,
    depth : 3,
    colors : Settings.colors
  }).replace(/^\s{2}/gm, '     '));
}

function logTimestamp() {
  if (Settings.log_timestamp) {
    return colors.white(timestamp());
  }

  return '';
}

const colors = new ConsoleColor();

function logMessage(type, message, args, alwaysShow) {
  if (!message || !Settings.outputEnabled || !Settings.enabled && !alwaysShow) {
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

  console[logMethod](timestamp, messageStr);

  if (args.length > 0) {
    let inlineArgs = [];
    args.forEach(function(item) {
      if (item === undefined) {
        return;
      }

      if (Object.prototype.toString.call(item) === '[object Object]' && Object.keys(item).length > 0) {
        if (inlineArgs.length) {
          console[logMethod](...inlineArgs);
          inlineArgs = [];
        }
        logObject(item);
      } else {
        inlineArgs.push(item);
      }
    });

    if (inlineArgs.length) {
      console[logMethod](...inlineArgs);
      inlineArgs = [];
    }
  }
}

function logError(severity, errOrMessage, args) {
  const Utils = require('./utils.js');

  if (Utils.isErrorObject(errOrMessage) && (errOrMessage.showTrace === true || errOrMessage.showTrace === undefined)) {
    errOrMessage = Utils.errorToStackTrace(errOrMessage);
  }

  let alwaysDisplay = severity === Severity.ERROR;

  logMessage(severity, errOrMessage, args, alwaysDisplay);
}

const Logger = {
  colors: colors,

  info(message, ...args) {
    logMessage('INFO', message, args);
  },

  log(message, ...args) {
    logMessage('LOG', message, args);
  },

  warn(message, ...args) {
    logError('WARN', message, args);
  },

  error(message, ...args) {
    logError('ERROR', message, args);
  },

  disableColors() {
    Settings.colors = false;
    Object.keys(ConsoleColor.prototype).forEach(function (color) {
      ConsoleColor.prototype[color] = function (text) {
        return text;
      };
    });
  },

  disable() {
    Settings.enabled = false;
  },

  enable() {
    Settings.enabled = true;
  },

  setOutputEnabled(val = true) {
    Settings.outputEnabled = val;
  },

  isOutputEnabled() {
    return Settings.outputEnabled;
  },

  setDetailedOutput(val) {
    Settings.detailedOutput = val;
  },

  isDetailedOutput() {
    return Settings.outputEnabled && Settings.detailedOutput;
  },

  isEnabled() {
    return Settings.enabled;
  },

  logDetailedMessage(message, type = 'log') {
    if (!Settings.outputEnabled || !Settings.detailedOutput) {
      return;
    }

    console[type](message);
  }
};

module.exports = Logger;
