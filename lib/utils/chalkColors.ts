import chalk from 'chalk';

interface CustomColors {
  dark_gray?: chalk.Chalk;
  light_blue?: chalk.Chalk;
  light_green?: chalk.Chalk;
  light_cyan?: chalk.Chalk;
  light_red?: chalk.Chalk;
  light_purple?: chalk.Chalk;
  light_gray?: chalk.Chalk;
  purple?: chalk.Chalk;
  brown?: chalk.Chalk;
  stack_trace?: chalk.Chalk;
}

class ChalkColors {
  instance: chalk.Chalk & CustomColors;
  origLevel: chalk.Level;
  prevLevel: chalk.Level;

  constructor() {
    this.instance = new chalk.Instance();
    this.origLevel = this.prevLevel = this.instance.level;

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

export = new ChalkColors();
