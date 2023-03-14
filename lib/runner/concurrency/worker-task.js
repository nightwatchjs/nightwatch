const boxen = require('boxen');
const {MessageChannel} = require('worker_threads');
const {Logger, symbols} = require('../../utils');
const EventEmitter = require('events');

let prevIndex = 0;

class WorkerTask extends EventEmitter {

  static get prevIndex() {
    return prevIndex;
  }

  static set prevIndex(val) {
    prevIndex = val;
  }

  constructor({piscina, index, label, settings, argv, task_ouput}) {
    super();

    this.task_output = task_ouput || [];
    this.piscina = piscina;
    this.label = label;
    this.settings = settings;
    this.argv = argv;
    this.index = index;
    this.task_label = '';
  }  

  printLog(msg) {
    if (this.settings.output) {
      // eslint-disable-next-line no-console
      console.info(msg);
    }
  }

  setlabel(colorPair) {
    this.task_label = this.settings.disable_colors ? ` ${this.label} ` :  Logger.colors[colorPair[1]](` ${this.label} `, Logger.colors.background[colorPair[0]]);
  }

  writeToStdOut(data) {
    let output = '';

    if (WorkerTask.prevIndex !== this.index) {
      WorkerTask.prevIndex = this.index; 
      if (this.settings.live_output) {
        output += '\n';
      }
    }

    if (this.settings.output && (this.settings.detailed_ouput || !this.settings.silent)) {
      const lines = data.split('\n').map(line => this.env_label + ' ' + line + ' ');
      data = lines.join('\n');
    }

    output += data;

    if (this.settings.live_output) {
      process.stdout.write(output + '\n');
    } else {
      this.task_output.push(output);
    }
  }

  async runWorkerTask(colors, type) {
    this.availColors = colors;
    const colorPair = this.availColors[this.index%4];
    this.setlabel(colorPair);
   
    this.printLog('Running '+ Logger.colors[colorPair[1]](` ${this.task_label} `, Logger.colors.background[colorPair[0]]));
    
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ({data: result}) => {
      switch (result.type) {
        case 'testsuite_finished':
          result.itemKey = this.label,
          this.emit('message', result);
          break;

        case 'stdout': 
          this.writeToStdOut(result.data);
          break;
      }
    };
    port2.unref();

    return this.piscina.run({argv: this.argv, port1}, {transferList: [port1]})
      .then(failures => {
        // eslint-disable-next-line no-console
        console.log(boxen(this.task_output.join('\n'), {title: `────────────────── ${failures ? symbols.fail : symbols.ok} ${this.task_label}`, padding: 1, borderColor: 'cyan'}));
      });
  }
}

module.exports = WorkerTask;