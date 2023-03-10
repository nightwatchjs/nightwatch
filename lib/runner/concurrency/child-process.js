const child_process = require('child_process');
const EventEmitter = require('events');
const {Logger, isObject, symbols} = require('../../utils');
const ProcessListener = require('../../runner/process-listener.js');

let prevIndex = 0;

class ChildProcess extends EventEmitter {
  static get defaultStartDelay() {
    return 10;
  }

  static get prevIndex() {
    return prevIndex;
  }

  static set prevIndex(val) {
    prevIndex = val;
  }

  constructor(environment, index, env_output, settings, args) {
    super();

    this.settings = settings;
    this.env_output = env_output || [];
    this.mainModule = process.mainModule.filename;
    this.index = index;
    this.itemKey = this.getChildProcessEnvKey(environment);
    this.startDelay = settings.parallel_process_delay || ChildProcess.defaultStartDelay;
    this.environment = environment;
    this.child = null;
    this.globalExitCode = 0;
    this.env_label = '';
    this.args = args || [];
  }

  setLabel(label) {
    this.env_itemKey = label;
    this.env_label = this.settings.disable_colors ? ` ${label} ` : Logger.colors.yellow(` ${label} `, Logger.colors.background.black);

    return this;
  }

  printLog(msg) {
    if (this.settings.output) {
      // eslint-disable-next-line no-console
      console.info(msg);
    }
  }

  getChildProcessEnvKey(env) {
    return `${env}_${this.index + 1}`;
  }

  /**
   * Returns an array of cli arguments to be passed to the child process,
   * based on the args passed to the main process
   * @returns {Array}
   */
  getArgs() {
    const args = [];

    if (isObject(this.settings.test_workers)) {
      const {node_options} = this.settings.test_workers;
      if (node_options === 'auto' || node_options === 'inherit' || node_options === true) {
        args.push.apply(args, process.execArgv);
      } else if (Array.isArray(node_options)) {
        args.push.apply(args, node_options);
      }
    }

    args.push(this.mainModule);
    args.push.apply(args, this.args);
    args.push('--parallel-mode');

    return args;
  }


  writeToStdout(data) {
    data = data.toString().trim();

    let color_pair = this.availColors[this.index%4];
    let output = '';

    if (ChildProcess.prevIndex !== this.index) {
      ChildProcess.prevIndex = this.index;
      if (this.settings.live_output) {
        output += '\n';
      }
    }

    if (this.settings.output && (this.settings.detailed_output || !this.settings.silent)) {
      let childProcessLabel;
      if (this.settings.disable_colors) {
        childProcessLabel = ' ' + this.environment + ' ';
      } else {
        childProcessLabel = '';
        this.env_label = Logger.colors[color_pair[1]](` ${this.environment} `, Logger.colors.background[color_pair[0]]);
      }

      let lines = data.split('\n').map(line => {
        return childProcessLabel + ' ' + line + ' ';
      });

      data = lines.join('\n');
    }

    output += data;

    if (this.settings.live_output) {
      process.stdout.write(output + '\n');
    } else {
      this.env_output.push(output);
    }
  }

  run(colors, type) {
    this.availColors = colors;

    let cliArgs = this.getArgs();
    let env = {};

    Object.keys(process.env).forEach(function(key) {
      env[key] = process.env[key];
    });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        env.__NIGHTWATCH_PARALLEL_MODE = '1';
        env.__NIGHTWATCH_ENV = this.environment;
        env.__NIGHTWATCH_ENV_KEY = this.itemKey;
        env.__NIGHTWATCH_ENV_LABEL = this.env_itemKey;
        env.__NIGHTWATCH_PARALLEL_TYPE = type;

        this.child = child_process.spawn(process.execPath, cliArgs, {
          cwd: process.cwd(),
          encoding: 'utf8',
          env,
          stdio: [null, null, null, 'ipc']
        });

        if (typeof this.child.send == 'function') {
          this.child.send(JSON.stringify({
            type: 'vite',
            vite_port: this.settings.vite_port
          }));
        }

        let color_pair = this.availColors[this.index%4];

        this.printLog(' Running: ' + Logger.colors[color_pair[1]](` ${this.env_itemKey} `, Logger.colors.background[color_pair[0]]));

        this.child.stdout.on('data', data => {
          this.writeToStdout(data);
        });

        this.child.on('message', message => {
          this.emit('message', message);
        });

        this.child.stderr.on('data', data => {
          this.writeToStdout(data);
        });

        this.processListener = new ProcessListener(this.child);

        this.child.on('exit', code => {
          this.printLog('');

          let status = code > 0 ? symbols.fail : symbols.ok;
          // eslint-disable-next-line no-console
          console.log(`\n${status} ${this.env_label}`, this.env_output.join('\n'), '\n');

          code = code || this.processListener.exitCode;
          resolve(code);
        });


      }, this.index * this.startDelay);
    });
  }
}

module.exports = ChildProcess;
