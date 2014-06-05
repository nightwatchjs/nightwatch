var Runner = require('../lib/runner/run.js');
var Logger = require('../lib/util/logger.js');
var Selenium = require('../lib/runner/selenium.js');
var util = require('util');
var fs = require('fs');
var path = require('path');

var SETTINGS_DEPRECTED_VAL = './settings.json';

function CliRunner(argv) {
  this.settings = null;
  this.argv = argv;
  this.test_settings = null;
  this.output_folder = '';
  this.parallelMode = false;
  this.cli = require('./_cli.js');
}

CliRunner.prototype = {
  init : function() {
    this
      .readSettings()
      .setOutputFolder()
      .parseTestSettings();

    return this;
  },

  /**
   * Read the provided config json file; defaults to settings.json if one isn't provided
   */
  readSettings : function() {
    // use default nightwatch.json file if we haven't received another value
    if (this.cli.command('config').isDefault(this.argv.c)) {
      var defaultValue = this.cli.command('config').defaults();
      var deprecatedValue = SETTINGS_DEPRECTED_VAL;

      if (fs.existsSync(defaultValue)) {
        this.argv.c = path.join(path.resolve('./'), this.argv.c);
      } else if (fs.existsSync(deprecatedValue)) {
        this.argv.c = path.join(path.resolve('./'), deprecatedValue);
      } else {
        var defaultFile = path.join(__dirname, this.argv.c);
        if (fs.existsSync(defaultFile)) {
          this.argv.c = defaultFile;
        } else {
          this.argv.c = path.join(__dirname, deprecatedValue);
        }
      }
    } else {
      this.argv.c = path.resolve(this.argv.c);
    }

    // reading the settings file
    try {
      this.settings = require(this.argv.c);
      this.replaceEnvVariables();
      this.manageSelenium = !this.isParallelMode() && this.settings.selenium &&
        this.settings.selenium.start_process || false;
      if (typeof this.settings.src_folders == 'string') {
        this.settings.src_folders = [this.settings.src_folders];
      }
    } catch (ex) {
      Logger.error(ex);
      this.settings = {};
    }

    return this;
  },

  isParallelMode : function() {
    return process.env.__NIGHTWATCH_PARALLEL_MODE === '1';
  },

  /**
   * Looks for pattern ${VAR_NAME} in settings
   * @param {Object} [target]
   */
  replaceEnvVariables : function(target) {
    target = target || this.settings;
    for (var key in target) {
      switch(typeof target[key]) {
      case 'object':
        this.replaceEnvVariables(target[key]);
        break;
      case 'string':
        target[key] = target[key].replace(/\$\{(\w+)\}/g, function(match, varName) {
          return process.env[varName] || '${' + varName + '}';
        });
        break;
      }
    }

    return this;
  },


  /**
   * Reads globals from an external js or json file set in the settings file
   * @returns {*}
   */
  readExternalGlobals : function () {
    if (!this.settings.globals_path) {
      return this;
    }
    try {
      var fullPath = path.resolve(this.settings.globals_path);
      if (fs.existsSync(fullPath)) {
        var globals = this.test_settings.globals = require(fullPath);
        if (globals && globals.hasOwnProperty(this.argv.e)) {
          for (var prop in globals[this.argv.e]) {
            this.test_settings.globals[prop] = globals[this.argv.e][prop];
          }
        }
        return this;
      }

      throw new Error('External global file could not be located - using '+ this.settings.globals_path +'.');
    } catch (err) {
      err.message = 'Failed to load external global file: ' + err.message;
      throw err;
    }
  },

  /**
   * @returns {CliRunner}
   */
  setOutputFolder : function() {
    this.output_folder = this.cli.command('output').isDefault(this.argv.o) && this.settings.output_folder || this.argv.o;
    return this;
  },

  /**
   * @param err
   */
  globalErrorHandler : function(err) {
    if (err) {
      Logger.enable();
      if (!err.message) {
        err.message = 'There was an error while running the test.';
      }

      if (this.test_settings.output) {
        console.error(Logger.colors.red(err.message));
      }

      process.exit(1);
    }
  },

  /**
   * Returns the path where the tests are located
   * @returns {*}
   */
  getTestSource : function() {
    var testsource;
    if (typeof this.argv.t == 'string') {
      testsource =  (this.argv.t.indexOf(process.cwd()) === -1) ?
        path.join(process.cwd(), this.argv.t) :
        this.argv.t;
      if (testsource.substr(-3) != '.js') {
        testsource += '.js';
      }
      try {
        fs.statSync(testsource);
      } catch (err) {
        throw new Error('There was a problem reading the test file: ' + testsource);
      }
    } else if (typeof this.argv.g == 'string') {
      testsource = this.findGroupPath(this.argv.g);
    } else {
      testsource = this.settings.src_folders;
    }

    return testsource;
  },

  /**
   * Attempting to prepend the base source folder to the group name;
   * this only works if only one source folder is defined in the src_folders property
   *
   * @param {string} groupName
   * @return {Array}
   */
  findGroupPath : function(groupName) {
    if (this.settings.src_folders.length !== 1) {
      return [groupName];
    }
    var srcFolder = this.settings.src_folders[0], fullPath;
    if (groupName.indexOf(srcFolder) === 0) {
      fullPath = groupName;
    } else {
      fullPath = path.join(srcFolder, groupName);
    }
    return [fullPath];
  },

  /**
   * Starts the selenium server process
   * @param {function} [callback]
   * @returns {CliRunner}
   */
  startSelenium : function(callback) {
    callback = callback || function() {};

    if (!this.manageSelenium) {
      callback();
      return this;
    }
    this.settings.parallelMode = this.parallelMode;
    var self = this;

    Selenium.startServer(this.settings, function(error, child, error_out, exitcode) {
      if (error) {
        if (self.test_settings.output) {
          Logger.error('There was an error while starting the Selenium server:');
        }
        self.globalErrorHandler({
          message : error_out
        });
        return;
      }

      callback();

    });
    return this;
  },

  /**
   * Stops the selenium server if it is running
   * @returns {CliRunner}
   */
  stopSelenium : function() {
    if (this.manageSelenium) {
      Selenium.stopServer();
    }
    return this;
  },

  /**
   * Starts the test runner
   * @returns {CliRunner}
   */
  runTests : function() {
    if (this.parallelMode) {
      return this;
    }

    var source = this.getTestSource();
    var self = this;
    this.startSelenium(function() {
      Runner.run(source, self.test_settings, {
        output_folder : self.output_folder,
        src_folders : self.settings.src_folders,
        live_output : self.settings.live_output
      }, function(err) {
        self
          .stopSelenium()
          .globalErrorHandler(err);
      });
    });

    return this;
  },

  inheritFromDefaultEnv : function() {
    if (this.argv.e == 'default') {
      return;
    }
    var defaultEnv = this.settings.test_settings['default'] || {};
    for (var key in defaultEnv) {
      if (typeof this.test_settings[key] == 'undefined') {
        this.test_settings[key] = defaultEnv[key];
      }
    }
  },

  /**
   * Validates and parses the test settings
   * @returns {CliRunner}
   */
  parseTestSettings : function() {
    // checking if the env passed is valid
    if (!this.settings.test_settings) {
      throw new Error('No testing environment specified.');
    }

    var envs = this.argv.e.split(',');
    for (var i = 0; i < envs.length; i++) {
      if (!(envs[i] in this.settings.test_settings)) {
        throw new Error('Invalid testing environment specified: ' + envs[i]);
      }
    }

    if (envs.length > 1) {
      this.setupParallelMode(envs);
      return this;
    }

    this.setTestSettings(this.argv.e);

    return this;
  },

  /**
   * Sets the specific test settings for the specified environment
   * @param {string} env
   * @returns {CliRunner}
   */
  setTestSettings : function(env) {
    // picking the environment specific test settings
    this.test_settings = this.settings.test_settings[env];
    this.test_settings.custom_commands_path = this.settings.custom_commands_path || '';
    this.test_settings.custom_assertions_path = this.settings.custom_assertions_path || '';

    this.inheritFromDefaultEnv();

    // overwrite selenium settings per environment
    if (this.test_settings.selenium && typeof (this.test_settings.selenium) == 'object') {
      for (var prop in this.test_settings.selenium) {
        this.settings.selenium[prop] = this.test_settings.selenium[prop];
      }
    }

    this.mergeSeleniumOptions();

    // read the external globals, if any
    this.readExternalGlobals();

    if (this.argv.verbose) {
      this.test_settings.silent = false;
    }

    this.test_settings.output = this.test_settings.output || typeof this.test_settings.output == 'undefined';

    if (typeof this.argv.s == 'string') {
      this.test_settings.skipgroup = this.argv.s.split(',');
    }

    if (this.argv.f) {
      this.test_settings.filename_filter = this.argv.f;
    }

    if (this.test_settings.disable_colors) {
      Logger.disableColors();
    }

    return this;
  },

  /**
   * Backwards compatible method which attempts to merge deprecated driver specific options for selenium
   * @returns {CliRunner}
   */
  mergeSeleniumOptions : function() {
    if (!this.manageSelenium) {
      return this;
    }
    this.settings.selenium.cli_args = this.settings.selenium.cli_args || {};

    var deprecationNotice = function(propertyName, newSettingName) {
      console.warn(Logger.colors.brown('DEPRECATION NOTICE: Property ' + propertyName + ' is deprecated since v0.5. Please' +
        ' use the "cli_args" object on the "selenium" property to define "' + newSettingName + '". E.g.:'));
      var demoObj = '{\n' +
        '  "cli_args": {\n' +
        '    "'+ Logger.colors.yellow(newSettingName) +'": "<VALUE>"\n' +
        '  }\n' +
        '}';

      console.log(demoObj, '\n');
    };

    if (this.test_settings.firefox_profile) {
      deprecationNotice('firefox_profile', 'webdriver.firefox.profile');
      this.settings.selenium.cli_args['webdriver.firefox.profile'] = this.test_settings.firefox_profile;
    }
    if (this.test_settings.chrome_driver) {
      deprecationNotice('chrome_driver', 'webdriver.chrome.driver');
      this.settings.selenium.cli_args['webdriver.chrome.driver'] = this.test_settings.chrome_driver;
    }
    if (this.test_settings.ie_driver) {
      deprecationNotice('ie_driver', 'webdriver.ie.driver');
      this.settings.selenium.cli_args['webdriver.ie.driver'] = this.test_settings.ie_driver;
    }

    return this;
  },

  /**
   * Enables parallel execution mode
   * @param {Array} envs
   * @returns {CliRunner}
   */
  setupParallelMode : function(envs) {
    this.parallelMode = true;
    var self = this;

    this.startSelenium(function() {
      self.startChildProcesses(envs, function(o) {
        self.stopSelenium();
      });
    });


    return this;
  },

  /**
   * Returns an array of cli arguments to be passed to the child process,
   * based on the args passed to the main process
   * @returns {Array}
   */
  getChildProcessArgs : function(mainModule) {
    var args = [mainModule];
    for (var i = 2; i < process.argv.length; i++) {
      if (process.argv[i] == '-e' || process.argv[i] == '--env') {
        i++;
      } else {
        args.push(process.argv[i]);
      }
    }
    return args;
  },

  /**
   * Start a new child process for each environment
   * @param {Array} envs
   * @param {function} finishCallback
   */
  startChildProcesses : function(envs, finishCallback) {
    var execFile = require('child_process').execFile, child, self = this;
    var mainModule = process.mainModule.filename;
    finishCallback = finishCallback || function() {};

    var availColors = [
      ['red', 'light_gray'], ['green', 'black'], ['blue', 'light_gray'], ['magenta', 'light_gray']
    ];
    var currentIndex = availColors.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = availColors[currentIndex];
      availColors[currentIndex] = availColors[randomIndex];
      availColors[randomIndex] = temporaryValue;
    }

    var prevIndex = 0;
    var output = {};
    var writeToSdtout = function(data, item, index) {
      data = data.replace(/^\s+|\s+$/g, '');
      output[item] = output[item] || [];

      var env_output = '';
      var color_pair = availColors[index%4];
      if (prevIndex !== index) {
        prevIndex = index;
        if (self.settings.live_output) {
          env_output += '\n';
        }
      }

      env_output += Logger.colors[color_pair[1]](' ' + item + ' ',
        Logger.colors.background[color_pair[0]]);

      if (self.settings.live_output) {
        env_output += ' ' + data;
      } else {
        env_output += '\t' + data + '\n';
      }

      if (self.settings.live_output) {
        console.log(env_output);
      } else {
        output[item].push(env_output);
      }
    };

    envs.forEach(function(item, index) {
      var cliArgs = self.getChildProcessArgs(mainModule);
      cliArgs.push('-e', item, '__parallel-mode');
      var env = process.env;
      setTimeout(function() {
        env.__NIGHTWATCH_PARALLEL_MODE = 1;
        env.__NIGHTWATCH_ENV = item;

        child = execFile(process.execPath, cliArgs, {
          cwd : process.cwd(),
          encoding: 'utf8',
          env : env
        }, function (error, stdout, stderr) {});

        console.log('Started child process for env:',
          Logger.colors.yellow(' ' + item + ' ', Logger.colors.background.black), '\n');

        child.stdout.on('data', function (data) {
          writeToSdtout(data, item, index);
        });

        child.stderr.on('data', function (data) {
          writeToSdtout(data, item, index);
        });

        child.on('close', function (code) {
          if (!self.settings.live_output) {
            var child_output = output[item];
            for (var i = 0; i < child_output.length; i++) {
              process.stdout.write(child_output[i]);
            }
            console.log('');
          }

          if (index === (envs.length - 1)) {
            finishCallback(output);
          }
        });
      }, index * 10);
    });
  }
};

module.exports = CliRunner;
