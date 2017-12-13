const ChildProcess = require('./child-process.js');

class Concurrency {
  constructor(settings = {}, argv = {}) {
    this.argv = argv;
    this.settings = settings;
    this.childProcessOutput = {};
    this.runningProcesses = {};
  }

  static getChildProcessArgs(envs) {
    let childProcessArgs = [];
    let arg;

    for (let i = 2; i < process.argv.length; i++) {
      arg = process.argv[i];
      if (envs && (arg === '-e' || arg === '--env')) {
        i++;
      } else {
        childProcessArgs.push(arg);
      }
    }

    return childProcessArgs;
  }

  static getAvailableColors() {
    let availColorPairs = [
      ['red', 'light_gray'],
      ['green', 'black'],
      ['blue', 'light_gray'],
      ['magenta', 'light_gray']
    ];
    let currentIndex = availColorPairs.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = availColorPairs[currentIndex];
      availColorPairs[currentIndex] = availColorPairs[randomIndex];
      availColorPairs[randomIndex] = temporaryValue;
    }

    return availColorPairs;
  }

  static isParallelMode() {
    return process.env.__NIGHTWATCH_PARALLEL_MODE === '1';
  }

  /**
   *
   * @param {Array} envs
   * @param {function} done
   */
  runEnvironments(envs = [], done = function() {}) {
    let globalExitCode = 0;
    let args = Concurrency.getChildProcessArgs(envs);
    let availColors = Concurrency.getAvailableColors();

    envs.forEach((environment, index) => {
      this.childProcessOutput[environment] = [];
      let childArgs = args.slice();
      childArgs.push('--env', environment);

      let childProcess = new ChildProcess(environment, index, this.childProcessOutput[environment], this.settings, childArgs);

      childProcess
        .setLabel(environment + ' environment')
        .run(availColors, (output, exitCode) => {
          if (exitCode > 0) {
            globalExitCode = exitCode;
          }

          if (this.processesRunning() === 0) {
            if (!this.settings.live_output) {
              this.printChildProcessOutput();
            }
            done(globalExitCode);
          }
        });

      this.runningProcesses[childProcess.itemKey] = childProcess;
    });
  }

  runTestWorkers(done = function() {}) {

  }

  processesRunning() {
    let running = 0;

    Object.keys(this.runningProcesses).forEach(key => {
      if (this.runningProcesses[key].processRunning) {
        running += 1;
      }
    });

    return running;
  }

  printChildProcessOutput(label) {
    if (label) {
      this.childProcessOutput[label] = this.childProcessOutput[label].filter(item => {
        return item !== '';
      }).map(item => {
        if (item == '\\n') {
          item = '\n';
        }

        return item;
      });

      this.childProcessOutput[label].forEach(function(output) {
        process.stdout.write(output + '\n');
      });

      this.childProcessOutput[label].length = 0;

      return;
    }

    Object.keys(this.childProcessOutput).forEach(environment => {
      this.printChildProcessOutput(environment);
    });
  }
}

module.exports = Concurrency;