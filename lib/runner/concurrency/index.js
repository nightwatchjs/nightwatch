const EventEmitter = require('events');
const Utils = require('../../utils');
const {isObject, isNumber} = Utils;
const lodashClone = require('lodash.clone');
const WorkerPool = require('./worker-process.js');
const {Logger} = Utils;

class Concurrency extends EventEmitter {
  constructor(settings = {}, argv = {}, isTestWorkerEnabled) {
    super();

    this.argv = argv;
    this.settings = lodashClone(settings, true);
    this.childProcessOutput = {};
    this.globalExitCode = 0;
    this.testWorkersEnabled = typeof isTestWorkerEnabled !== 'undefined' ? isTestWorkerEnabled : settings.testWorkersEnabled;
  }

  /**
   *
   * @param {Array} envs
   * @param {Array} modules
   */
  runMultiple(envs = [], modules) {
    return this.runWorkerProcesses(envs, modules)
      .catch(_ => {
        this.globalExitCode = 1;
      })
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
  runWorkerProcesses(envs, modules) {
    const availColors = Concurrency.getAvailableColors();

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

      return this.runMultipleTestWorkers(jobs, availColors);
    }

    return this.runTestEnvironments(envs, availColors);
  }

  /**
   *
   * @param {Array} envs
   * @param {Array} availColors
   * @return {Promise}
   */
  runTestEnvironments(envs, availColors) {

    let maxWorkerCount = this.getTestWorkersCount();
    const remaining = envs.length;

    maxWorkerCount = Math.min(maxWorkerCount, remaining);


    const workerPool = this.setupWorkerPool(['--parallel-mode'], this.settings, null);

    envs.forEach((env) => {
      const workerArgv = {...this.argv};
      workerArgv.env = workerArgv.e = env;
      workerPool.addTask({
        argv: workerArgv,
        settings: this.settings,
        label: env + ' environment',
        colors: availColors
      });
    });

    return Promise.all(workerPool.tasks);
  }

  /**
   *
   * @param {Array} modules
   * @param {Array} availColors
   */
  runMultipleTestWorkers(modules, availColors) {
    let maxWorkerCount = this.getTestWorkersCount();
    const remaining = modules.length;

    maxWorkerCount = Math.min(maxWorkerCount, remaining);

    if (this.settings.output) {
      Logger.info(`Launching up to ${maxWorkerCount} concurrent test worker processes...\n`);
    }

    const workerPool = this.setupWorkerPool(['--test-worker', '--parallel-mode'], this.settings, maxWorkerCount);

    modules.forEach(({module, env}) => {
      let outputLabel = Utils.getModuleKey(module, this.settings.src_folders, modules);
      outputLabel = env ? `${env}: ${outputLabel}` : outputLabel;
      
      const workerArgv = {...this.argv};
      workerArgv._source = [module];
      workerArgv.env = env;
      workerArgv['test-worker'] = true;

      return workerPool.addTask({
        argv: workerArgv,
        settings: this.settings,
        label: outputLabel,
        colors: availColors
      });
    });

   
    return Promise.all(workerPool.tasks);
  }


  /**
   * 
   * @param {Array} args 
   * @param {Object} settings 
   * @param {Number} maxWorkerCount 
   */
  setupWorkerPool(args, settings, maxWorkerCount) {
    const workerPool = new WorkerPool(args, settings, maxWorkerCount);
    workerPool.on('message', data => {
      this.emit(data);
    });

    return workerPool;
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
      if (workers < test_workers.workers) {
        // eslint-disable-next-line no-console
        Logger.warn(`Number of max workers is set to ${test_workers.workers} while the number of cpu cores is ${workers}. This can cause performance issues...\n`);
      } else {
        workers = test_workers.workers;
      }
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
          const item = queue.shift();
          fn(item.env, item.module, index++, next);
        } else {
          done();
        }
      }
    };

    process();
  }

  static getAvailableColors() {
    const availColorPairs = [
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

  static isWorker() {
    return WorkerPool.isWorkerThread;
  }

  static isTestWorker(argv = {}) {
    return Concurrency.isWorker() && argv['test-worker'];
  }

  static isMasterProcess() {
    return !Concurrency.isWorker();
  }
}

module.exports = Concurrency;
