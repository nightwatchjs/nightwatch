const boxen = require('boxen');
const {Logger, isObject, symbols} = require('../../utils');
const path = require('path');
const safeJSON = require('../../utils/safeStringify');

let prevIndex = 0;

class WorkerTask {

  static get prevIndex() {
    return prevIndex;
  }

  static set prevIndex(val) {
    prevIndex = val;
  }

  constructor({piscina, index, label, settings, argv, task_ouput}) {
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

  //TODO: check if this method is really required.
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
      process.stdout(output + '\n');
    } else {
      this.task_output.push(output);
    }
  }

  async runWorkerTask(colors, type) {
    this.availColors = colors;
    const colorPair = this.availColors[this.index%4];
    this.setlabel(colorPair);
   
    this.printLog('Running '+ Logger.colors[colorPair[1]](` ${this.task_label} `, Logger.colors.background[colorPair[0]]));
   

    const safeSettings = safeJSON.safeJSON(this.settings);
    const {port1, port2} = new MessageChannel();
    port2.onmessage = (result) => {
      this.writeToStdOut(result.data);
    };
    port2.unref();

    return this.piscina.run({argv: this.argv, settings: safeSettings, port1}, {transferList: [port1]})
      .then(failures => {
        // eslint-disable-next-line no-console
        console.log(boxen(this.task_output.join('\n'), {title: `────────────────── ${failures ? symbols.fail : symbols.ok} ${this.task_label}`, padding: 1, borderColor: 'cyan'}));
      });
     
  }

  


}

module.exports = WorkerTask;