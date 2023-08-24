const chalk = require('chalk');

class ChalkColors {
  constructor() {
    this.instance = new chalk.Instance();
    this.origLevel = this.instance.level;

    this.loadCustomColors(); // for backward compatibility

    if (process.env.COLORS === '0') {
      this.disable();
    }
  }

  loadCustomColors() {
    const colorsInstance = this.instance;

    // foreground colors
    colorsInstance.dark_gray = colorsInstance.black.bold;
    colorsInstance.light_blue = colorsInstance.blue.bold;
    colorsInstance.light_green = colorsInstance.green.bold;
    colorsInstance.light_cyan = colorsInstance.cyan.bold;
    colorsInstance.light_red = colorsInstance.red.bold;
    colorsInstance.light_purple = colorsInstance.magenta.bold;
    colorsInstance.light_gray = colorsInstance.white;

    colorsInstance.purple = colorsInstance.magenta;
    colorsInstance.brown = colorsInstance.yellow;
    colorsInstance.stack_trace = colorsInstance.gray;
  }

  get colors() {
    return this.instance;
  }

  get colorsEnabled() {
    return this.instance.level !== 0;
  }

  disable() {
    this.prevLevel = this.instance.level;
    this.instance.level = 0;
  }

  enable() {
    this.instance.level = this.prevLevel;
  }

  reset() {
    this.instance.level = this.origLevel;
  }
}

module.exports = new ChalkColors();
