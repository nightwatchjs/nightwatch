/**
 * Module dependencies
 */
const opt = require('optimist');
const DefaultSettings = require('../../settings/defaults.js');

module.exports = new (function() {

  const _DEFAULTS_ = {};
  const _COMMANDS_ = {};

  class Command {
    constructor(name) {
      this.name = name;
      _DEFAULTS_[this.name] = {};
    }

    demand(value) {
      if (!value && _DEFAULTS_[this.name].demand) {
        return _DEFAULTS_[this.name].demand;
      }

      _DEFAULTS_[this.name].demand = value;

      return this;
    }

    description(value) {
      if (!value && _DEFAULTS_[this.name].description) {
        return _DEFAULTS_[this.name].alias;
      }

      _DEFAULTS_[this.name].description = value;

      return this;
    }

    alias(value) {
      if (!value && _DEFAULTS_[this.name].alias) {
        return _DEFAULTS_[this.name].alias;
      }

      _DEFAULTS_[this.name].alias = value;

      return this;
    }

    defaults(value) {
      if (!value && _DEFAULTS_[this.name]['default']) {
        return _DEFAULTS_[this.name]['default'];
      }

      _DEFAULTS_[this.name]['default'] = value;

      return this;
    }

    isDefault(value) {
      return _DEFAULTS_[this.name]['default'] === value;
    }
  }

  this.showHelp = function() {
    return opt.showHelp();
  };

  this.command = function(name) {
    if (_COMMANDS_[name]) {
      return _COMMANDS_[name];
    }

    _COMMANDS_[name] = new Command(name);

    return _COMMANDS_[name];
  };

  this.init = function() {
    return opt.usage('Usage: $0 [source] [options]')
      .option('source', {
        string : true
      })
      .options(_DEFAULTS_).argv;
  };

  this.setup = function() {
    // CLI definitions

    // $ nightwatch -c
    // $ nightwatch --config
    this.command('config')
      .demand(true)
      .description('Path to configuration file')
      .alias('c')
      .defaults('./nightwatch.json');

    // $ nightwatch -o
    // $ nightwatch --output
    this.command('output')
      .description('Where to save the (JUnit XML) test reports.')
      .alias('o');

    // $ nightwatch -r
    // $ nightwatch --reporter
    this.command('reporter')
      .description('Name of a predefined reporter (e.g. junit) or path to a custom reporter file to use.')
      .alias('r')
      .defaults(DefaultSettings.default_reporter);

    // $ nightwatch -e
    // $ nightwatch --env saucelabs
    this.command('env')
      .description('Testing environment to use.')
      .alias('e')
      .defaults('default');

    // $ nightwatch --verbose
    this.command('verbose')
      .description('Turns on selenium command logging during the session.');

    // $ nightwatch -t
    // $ nightwatch --test
    this.command('test')
      .description('Runs a single test.')
      .alias('t');

    // $ nightwatch --testcase
    this.command('testcase')
      .description('Used only together with --test. Runs the specified testcase from the current suite/module.');

    // $ nightwatch -g
    // $ nightwatch --group
    this.command('group')
      .description('Runs a group of tests (i.e. a folder)')
      .alias('g');

    // $ nightwatch -s
    // $ nightwatch --skipgroup
    this.command('skipgroup')
      .description('Skips one or several (comma separated) group of tests.')
      .alias('s');

    // $ nightwatch -f
    // $ nightwatch --filter
    this.command('filter')
      .description('Specify a filter (glob expression) as the file name format to use when loading the files.')
      .defaults('')
      .alias('f');

    // $ nightwatch -a
    // $ nightwatch --tag
    this.command('tag')
      .description('Only run tests with the given tag.')
      .defaults('')
      .alias('a');

    // $ nightwatch --skiptags
    this.command('skiptags')
      .description('Skips tests that have the specified tag or tags (comma separated).');

    // $ nightwatch --retries
    this.command('retries')
      .description('Retries failed or errored testcases up <n> times.');

    // $ nightwatch --suiteRetries
    this.command('suiteRetries')
      .description('Retries failed or errored testsuites up <n> times.');

    // $ nightwatch -h
    // $ nightwatch --help
    this.command('help')
      .description('Shows this help.')
      .alias('h');

    // $ nightwatch -v
    // $ nightwatch --version
    this.command('version')
      .alias('v')
      .description('Shows version information.');

    return this;
  };
})();
