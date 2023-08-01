const Settings = {
  enabled: process.env.COLORS !== '0'
};

function Background() {
  return this;
}

function ConsoleColor() {
  this.background = new Background();

  const foregroundColors = {
    black: '0;30',
    dark_gray: '1;30', // chalk.bold.black
    blue: '0;34',
    light_blue: '1;34',  // chalk.bold.blue
    green: '0;32',
    light_green: '1;32', // chalk.bold.green
    cyan: '0;36',
    light_cyan: '1;36', // chalk.bold.cyan
    red: '0;31',
    light_red: '1;31', // chalk.bold.red
    purple: '0;35', // chalk.magenta
    light_purple: '1;35', // chalk.magenta.bold
    brown: '0;33', // yellow
    yellow: '1;33', // yellow.bold <-- needs to be modified in codebase
    light_gray: '0;37', // white
    white: '1;37', // white.bold <-- needs to be modified in codebase
    stack_trace: '0;90' // equivalent to chalk.grey
  };

  const backgroundColors = {
    black: '40', // chalk.bgBlack
    red: '41', // bgRed
    green: '42', // bgGreen
    yellow: '43', // bgYellow
    blue: '44', // bgBlue
    magenta: '45', // bgMagenta
    cyan: '46', // bgCyan
    light_gray: '47' // bgWhite
  };

  Object.keys(foregroundColors).forEach(k => {
    ConsoleColor.prototype[k.toLowerCase()] = (text, background) => {
      if (!Settings.enabled) {
        return text;
      }

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

module.exports = new (function() {
  let instance;

  const disable = function() {
    Settings.enabled = false;

    Object.keys(ConsoleColor.prototype).forEach(function (color) {
      ConsoleColor.prototype[color] = function (text) {
        return text;
      };
    });
  };

  const enable = function() {
    Settings.enabled = true;
  };

  const setup = function() {
    instance = new ConsoleColor();
  };

  const initialize = function() {
    if (!Settings.enabled) {
      disable();
    }

    setup();
  };

  ////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////
  const exported = {
    disableColors() {
      disable();
      setup();
    },
    disable() {
      disable();
      setup();
    },
    enable() {
      enable();
      setup();
    }
  };

  Object.defineProperty(exported, 'colors', {
    configurable: true,
    get: function() {
      return instance;
    }
  });

  Object.defineProperty(exported, 'colorsEnabled', {
    configurable: true,
    get: function() {
      return Settings.enabled;
    }
  });

  initialize();

  return exported;
});
