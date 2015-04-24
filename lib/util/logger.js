var util = require('util');
var Settings = {
  log_timestamp : false,
  colors : true,
  enabled : true
};

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];

function getDate() {
  var now = new Date();
  return [now.toLocaleDateString(), now.toLocaleTimeString()].join(' ');
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

function getPrefix(tag, severity) {
  var levels = ['EMERG', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG'];
  return tag + ' ' + levels[severity] +' - ';
}

function ConsoleColor() {
  var self = this;
  var mappings = {
    blue  : '0;34',
    light_blue  : '1;34'
  };
  this.background = new Background();

  this.foreground_colors = {};
  this.foreground_colors['black'] = '0;30';
  this.foreground_colors['dark_gray'] = '1;30';
  this.foreground_colors['blue'] = '0;34';
  this.foreground_colors['light_blue'] = '1;34';
  this.foreground_colors['green'] = '0;32';
  this.foreground_colors['light_green'] = '1;32';
  this.foreground_colors['cyan'] = '0;36';
  this.foreground_colors['light_cyan'] = '1;36';
  this.foreground_colors['red'] = '0;31';
  this.foreground_colors['light_red'] = '1;31';
  this.foreground_colors['purple'] = '0;35';
  this.foreground_colors['light_purple'] = '1;35';
  this.foreground_colors['brown'] = '0;33';
  this.foreground_colors['yellow'] = '1;33';
  this.foreground_colors['light_gray'] = '0;37';
  this.foreground_colors['white'] = '1;37';

  this.background_colors = {};
  this.background_colors['black'] = '40';
  this.background_colors['red'] = '41';
  this.background_colors['green'] = '42';
  this.background_colors['yellow'] = '43';
  this.background_colors['blue'] = '44';
  this.background_colors['magenta'] = '45';
  this.background_colors['cyan'] = '46';
  this.background_colors['light_gray'] = '47';

  Object.keys(this.foreground_colors).forEach(function(k) {
    ConsoleColor.prototype[k.toLowerCase()] = function Foreground(text, background) {
      var string = '\033[' + self.foreground_colors[k.toLowerCase()] + 'm';
      if (background !== undefined) {
        string += background();
      }

      string += text + '\033[0m';
      return string;
    };
  });

  Object.keys(this.background_colors).forEach(function(k) {
    Background.prototype[k.toLowerCase()] = function Background(text) {
      return '\033[' + self.background_colors[k.toLowerCase()] + 'm';
    };
  });
  return this;
}
function Background() { return this; }

var colors = new ConsoleColor();
function logObject(obj) {
  console.log(util.inspect(obj, {
    showHidden : false,
    depth : 3,
    colors : Settings.colors
  }));
}

function logTimestamp() {
  if (Settings.log_timestamp) {
    return colors.white(timestamp()) + ' ';
  }
  return '';
}

function logMessage(type, message, args) {
  if (!message || !Settings.enabled) {
    return;
  }

  var messageStr = '';
  var timestamp = logTimestamp();
  switch (type) {
  case 'ERROR':
    messageStr = colors.yellow(type, colors.background.dark_gray) +' '+
                timestamp + colors.light_green(message);
    break;
  case 'INFO':
    messageStr = colors.light_purple(type, colors.background.black) +' '+
                timestamp + colors.light_cyan(message);
    break;
  case 'LOG':
    messageStr = colors.white(type+' ', colors.background.black) +' '+
                timestamp + colors.white(message);
    break;
  case 'WARN':
    messageStr = colors.light_green(type, colors.background.black) +' '+
                timestamp + colors.light_green(message);
    break;
  }

  process.stdout.write(messageStr);

  if (args.length > 0) {
    var inlineArgs = [];
    args.forEach(function(item) {
      if (Object.prototype.toString.call(item) === '[object Object]' && Object.keys(item).length > 0) {
        if (inlineArgs.length) {
          console.log.apply(console, inlineArgs);
          inlineArgs = [];
        }
        logObject(item);
      } else {
        inlineArgs.push(item);
      }
    });
    if (inlineArgs.length) {
      process.stdout.write(' ');
      console.log.apply(console, inlineArgs);
      inlineArgs = [];
    }
  } else {
    process.stdout.write('\n');
  }
}

exports.info = function(message) {
  var args = Array.prototype.slice.call(arguments, 1);
  logMessage('INFO', message, args);
};

exports.log = function(message) {
  var args = Array.prototype.slice.call(arguments, 1);
  logMessage('LOG', message, args);
};

exports.warn = function(message) {
  var args = Array.prototype.slice.call(arguments, 1);
  logMessage('WARN', message, args);
};

exports.error = function(message) {
  var args = Array.prototype.slice.call(arguments, 1);
  logMessage('ERROR', message, args);
};

exports.disableColors = function () {
  Settings.colors = false;
  Object.keys(ConsoleColor.prototype).forEach(function (color) {
    ConsoleColor.prototype[color] = function (text) {
      return text;
    };
  });
};

exports.disable = function() {
  Settings.enabled = false;
};
exports.enable = function() {
  Settings.enabled = true;
};
exports.isEnabled = function() {
  return Settings.enabled;
};
exports.colors = colors;
