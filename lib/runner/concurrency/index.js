const EventEmitter = require('events');
const Utils = require('../../utils');
const ChildProcess = require('./child-process.js');
const {isObject, isNumber} = Utils;
const lodashClone = require('lodash.clone');
const {Logger} = Utils;

class Concurrency extends EventEmitter {
  constructor(settings = {}, argv = {}, isTestWorkerEnabled, isSafariEnvPresent = false) {
    super();

    this.argv = argv;
    this.settings = lodashClone(settings, true);
    this.childProcessOutput = {};
    this.globalExitCode = 0;
    this.testWorkersEnabled = typeof isTestWorkerEnabled !== undefined ? isTestWorkerEnabled : settings.testWorkersEnabled;
    this.isSafariEnvPresent = isSafariEnvPresent;
  }

  static getChildProcessArgs(envs) {
    let childProcessArgs = [];
    let arg;

    for (let i = 2; i < process.argv.length; i++) {
      arg = process.argv[i];
      if (arg === '-e' || arg === '--env') {
        i++;
      } else if (!(arg.startsWith('--env=') || arg.startsWith('--e='))) {
        childProcessArgs.push(arg);
      }
    }

    return childProcessArgs;
  }

  /**
   *
   * @param {Array} envs
   * @param {Array} modules
   */
  runMultiple(envs = [], modules) {
    return this.runChildProcesses(envs, modules)
      .then(_ => {
        return this.globalExitCode;
      });
  }

  /**
   *
   * @param {Array} envs
   * @param {Array} [modules]
   * @return {Promise}
   */
  runChildProcesses(envs, modules) {
    const availColors = Concurrency.getAvailableColors();
    const args = Concurrency.getChildProcessArgs(envs);

    if (this.testWorkersEnabled) {
      const jobs = [];
      if (envs.length > 0) {
        envs.forEach((env) => {
          const envModules = modules[env];
          const jobList = envModules.map((module) => {
            return {
              env,
              module
            };
          });
          jobs.push(...jobList);
        });
      } else {
        const jobList = modules.map((module) => {
          return {
            module
          };
        });
        jobs.push(...jobList);
      }

      return this.runMultipleTestWorkers(jobs, args, availColors);
    }

    return this.runTestEnvironments(envs, args, availColors);
  }

  /**
   *
   * @param {Array} envs
   * @param {Array} args
   * @param {Array} availColors
   * @return {Promise}
   */
  runTestEnvironments(envs, args, availColors) {
    return Promise.all(envs.map((environment, index) => {
      const extraArgs = ['--env', environment];
      if (this.isSafariEnvPresent) {
        extraArgs.push('--serial');
      }
      let childProcess = this.createChildProcess(environment, args, extraArgs, index);

      return this.runChildProcess(childProcess, environment + ' environment', availColors, 'envs');
    }));
  }

  /**
   *
   * @param {Array} modules
   * @param {Array} args
   * @param {Array} availColors
   */
  runMultipleTestWorkers(modules, args, availColors) {
    let maxWorkerCount = this.getTestWorkersCount();
    let remaining = modules.length;

    maxWorkerCount = Math.min(maxWorkerCount, remaining);

    if (this.settings.output) {
      Logger.info(`Launching up to ${maxWorkerCount} concurrent test worker processes...\n`);
    }


    return new Promise((resolve, reject) => {
      Concurrency.buildProcessQueue(maxWorkerCount, modules, (env, modulePath, index, next) => {
        let outputLabel = Utils.getModuleKey(modulePath, this.settings.src_folders, modules);
        const flags = ['--test', modulePath, '--test-worker'];

        if (env) {
          flags.unshift('--env', env);
          outputLabel = `${env}: ${outputLabel}`;
        }

        const childProcess = this.createChildProcess(outputLabel, args, flags, index);

        return this.runChildProcess(childProcess, outputLabel, availColors, 'workers')
          .then(_ => {
            remaining -=1;

            if (remaining > 0) {
              next();
            } else {
              resolve();
            }
          });
      });
    });

  }

  /**
   *
   * @param {ChildProcess} childProcess
   * @param {String} outputLabel
   * @param {Array} availColors
   * @param {String} type
   * @return {Promise}
   */
  runChildProcess(childProcess, outputLabel, availColors, type) {
    return childProcess.setLabel(outputLabel)
      .run(availColors, type)
      .then(exitCode => {
        if (exitCode > 0) {
          this.globalExitCode = exitCode;
        }
      });
  }

  /**
   *
   * @param {String} label
   * @param {Array} args
   * @param {Array} extraArgs
   * @param {Number} index
   * @return {ChildProcess}
   */
  createChildProcess(label, args = [], extraArgs = [], index = 0) {
    this.childProcessOutput[label] = [];
    const childArgs = args.slice().concat(extraArgs);

    const childProcess = new ChildProcess(label, index, this.childProcessOutput[label], this.settings, childArgs);
    childProcess.on('message', data => {
      this.emit('message', data);
    });

    return childProcess;
  }

  /**
   * @param {String} [label]
   */
  printChildProcessOutput(label) {
    if (label) {
      this.childProcessOutput[label] = this.childProcessOutput[label].filter(item => {
        return item !== '';
      }).map(item => {
        if (item === '\\n') {
          item = '\n';
        }

        return item;
      });

      this.childProcessOutput[label].forEach(function(output) {
        process.stdout.write(output + '\n');
      });
      this.childProcessOutput[label] = [];

      return;
    }

    Object.keys(this.childProcessOutput).forEach(environment => {
      this.printChildProcessOutput(environment);
    });
  }

  /**
   * @return {number}
   */
  getTestWorkersCount() {
    const {test_workers} = this.settings;
    let workers = require('os').cpus().length;

    if (isObject(test_workers) && isNumber(test_workers.workers)) {
      if (workers < test_workers) {
        // eslint-disable-next-line no-console
        Logger.warn(`Number of max workers is set to ${test_workers.workers} while the number of cpu cores is ${workers}. This can cause performance issues...\n`);
      }
      workers = test_workers.workers;
    }

    return workers;
  }

  /**
   * @param {number} concurrency
   * @param {Array} modules
   * @param {function} fn
   */
  static buildProcessQueue(maxWorkers, modules, fn) {
    const queue = modules.slice(0);

    let workers = 0;
    let index = 0;

    const next = function() {
      workers -= 1;
      process();
    };

    const process = function(done = function() {}) {
      while (workers < maxWorkers) {
        workers += 1;

        if (queue.length) {
          let item = queue.shift();
          fn(item.env, item.module, index++, next);
        } else {
          done();
        }
      }
    };

    process();
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

  static isChildProcess() {
    return process.env.__NIGHTWATCH_PARALLEL_MODE === '1';
  }

  static isTestWorker(argv = {}) {
    return Concurrency.isChildProcess() && argv['test-worker'];
  }

  static isMasterProcess() {
    return !Concurrency.isChildProcess();
  }
}

module.exports = Concurrency;
