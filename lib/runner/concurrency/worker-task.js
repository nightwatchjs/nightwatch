const boxen = require('boxen');
const {MessageChannel} = require('worker_threads');
const {Logger, symbols} = require('../../utils');
const EventEmitter = require('events');
const {isString} = require('../../utils');

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
    this.startDelay = settings.parallel_process_delay;
    this.piscina = piscina;
    this.label = label;
    this.settings = settings;
    this.argv = argv;
    this.index = index;
    this.task_label = '';
    this.env_label = argv.env;
  }

  printLog(msg) {
    if (this.settings.output) {
      // eslint-disable-next-line no-console
      console.info(msg);
    }
  }

  setlabel(colorPair) {
    this.task_label = this.settings.disable_colors ? ` ${this.label} ` :  Logger.colors[colorPair[0]][colorPair[1]](` ${this.label} `);
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
    const colorPair = this.availColors[this.index % 4];
    this.setlabel(colorPair);

    this.printLog('Running ' + Logger.colors[colorPair[0]][colorPair[1]](` ${this.task_label} `));

    const {port1, port2} = new MessageChannel();
    port2.onmessage = ({data: result}) => {
      if (isString(result)) {
        try {
          result = JSON.parse(result);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

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

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.piscina.run({argv: this.argv, port1}, {transferList: [port1]})
          .catch(err => err)
          .then(failures => {
            if (this.settings.disable_output_boxes){
            // eslint-disable-next-line no-console
              console.log(`${failures ? symbols.fail : symbols.ok} ${this.task_label}\n`, this.task_output.join('\n'), '\n');
            } else {
            // eslint-disable-next-line no-console
              console.log(boxen(this.task_output.join('\n'), {title: `────────────────── ${failures ? symbols.fail : symbols.ok} ${this.task_label}`, padding: 1, borderColor: 'cyan'}));
            }

            //throw error to mark exit-code of the process
            if (failures) {
              return reject(new Error());
            }
            resolve();
          });
      }, this.index * this.startDelay);
    });
  }
}

module.exports = WorkerTask;
