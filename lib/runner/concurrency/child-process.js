const child_process = require('child_process');
const EventEmitter = require('events');
const {Logger} = require('../../utils');
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

  getChildProcessEnvKey(env) {
    return `${env}_${this.index + 1}`;
  }

  /**
   * Returns an array of cli arguments to be passed to the child process,
   * based on the args passed to the main process
   * @returns {Array}
   */
  getArgs() {
    let args = [this.mainModule];
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
        childProcessLabel = Logger.colors[color_pair[1]](` ${this.environment} `, Logger.colors.background[color_pair[0]]);
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
          env: env,
          stdio: [null, null, null, 'ipc']
        });

        Logger.info('Started child process for:' + this.env_label);

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
          code = code || this.processListener.exitCode;
          resolve(code);
        });


      }, this.index * this.startDelay);
    });
  }
}

module.exports = ChildProcess;
