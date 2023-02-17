const path = require('path');
const Piscina= require('piscina');
const {isWorkerThread} = Piscina;
const {EventEmitter} = require('stream');
const WorkerTask = require('./worker-task');

const WORKER_FILE = path.resolve(__dirname, 'task.js');

class WorkerPool extends EventEmitter {


  static get isWorkerThread() {
    return isWorkerThread;
  }

  get tasks() {
    return this.__tasks;
  }

  set tasks(tasks) {
    this.__tasks = tasks;
  }


  
  constructor(args, maxWorkerCount, settings) {
    super();

    this.settings = settings;
    args.push('--parallel-mode');
    args.push('--test-worker');


    this.piscina = new Piscina({
      filename: WORKER_FILE,
      argv: args,
      env: {
        __NIGHTWATCH_PARALLEL_MODE: '1'
       
      }
      
    });
    this.__tasks = [];
    this.index = 0;

  }




  /**
   * adds a task to running worker queue
   */
  addTask({label, argv, colors} = {}) {
    const workerTask = new WorkerTask({piscina: this.piscina, index: this.index, label, argv, settings: this.settings});
    
    workerTask.once('message', (data) => {
      this.emit('message', data);
    });

    this.index++;
    this.__tasks.push(workerTask.runWorkerTask(colors));
   
  }




}

module.exports = WorkerPool;
