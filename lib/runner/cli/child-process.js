var child_process = require('child_process');
var util = require('util');
var events = require('events');

var Logger = require('../../util/logger.js');

function ChildProcess(environment, index, env_output, settings, args) {
  events.EventEmitter.call(this);

  this.env_output = env_output || [];
  this.mainModule = process.mainModule.filename;
  this.index = index;
  this.itemKey = this.getChildProcessEnvKey(environment);
  this.startDelay = settings.parallel_process_delay || ChildProcess.defaultStartDelay;
  this.environment = environment;
  this.settings = settings;
  this.child = null;
  this.globalExitCode = 0;
  this.processRunning = false;
  this.env_label = '';
  this.args = args || [];
}

util.inherits(ChildProcess, events.EventEmitter);

ChildProcess.prevIndex = 0;
ChildProcess.defaultStartDelay = 10;

ChildProcess.prototype.setLabel = function(label) {
  this.env_itemKey = label;
  this.env_label = this.settings.disable_colors ?
    (' ' + label + ' ') : Logger.colors.yellow(' ' + label + ' ', Logger.colors.background.black);
  return this;
};

ChildProcess.prototype.run = function(colors, done) {
  this.availColors = colors;

  var cliArgs = this.getArgs();
  var env = {};
  Object.keys(process.env).forEach(function(key) {
    env[key] = process.env[key];
  });

  var self = this;

  setTimeout(function() {
    env.__NIGHTWATCH_PARALLEL_MODE = 1;
    env.__NIGHTWATCH_ENV = self.environment;
    env.__NIGHTWATCH_ENV_KEY = self.itemKey;
    env.__NIGHTWATCH_ENV_LABEL = self.env_itemKey;

    self.child = child_process.spawn(process.execPath, cliArgs, {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: env,
      stdio: [null, null, null, 'ipc']
    });

    self.child.on('message', function(data) {
      self.emit('result', JSON.parse(data));
    });

    self.processRunning = true;

    if (self.settings.output) {
      console.log('Started child process for:' + self.env_label);
    }

    self.child.stdout.on('data', function (data) {
      self.writeToStdout(data);
    });

    self.child.stderr.on('data', function (data) {
      self.writeToStdout(data);
    });

    self.child.on('exit', function (code) {
      if (self.settings.output) {
        console.log('\n  >>' + self.env_label + 'finished. ', '\n');
      }

      if (code) {
        self.globalExitCode = 2;
      }
      self.processRunning = false;
      done(self.env_output, code);
    });


  }, this.index * this.startDelay);
};

ChildProcess.prototype.getChildProcessEnvKey = function(env) {
  return env + '_' + (this.index+1);
};

/**
 * Returns an array of cli arguments to be passed to the child process,
 * based on the args passed to the main process
 * @returns {Array}
 */
ChildProcess.prototype.getArgs = function() {
  var args = [this.mainModule];
  args.push.apply(args, this.args);
  args.push('--parallel-mode');

  return args;
};


ChildProcess.prototype.writeToStdout = function(data) {
  data = data.toString().trim();

  var color_pair = this.availColors[this.index%4];
  var output = '';

  if (ChildProcess.prevIndex !== this.index) {
    ChildProcess.prevIndex = this.index;
    if (this.settings.live_output) {
      output += '\n';
    }
  }

  if (this.settings.output) {
    if (this.settings.disable_colors) {
      output += ' ' + this.environment + ' ';
    } else {
      output += Logger.colors[color_pair[1]](' ' + this.environment + ' ',
        Logger.colors.background[color_pair[0]]);
    }
    output += '  ';
  }

  output += data;

  if (this.settings.live_output) {
    process.stdout.write(output + '\n');
  } else {
    this.env_output.push(output);
  }
};

module.exports = ChildProcess;