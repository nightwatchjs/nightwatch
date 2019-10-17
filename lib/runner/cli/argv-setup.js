/**
 * Module dependencies
 */
const opt = require('optimist');
const DefaultSettings = require('../../settings/defaults.js');

module.exports = new (function() {
  const __Options__ = {};
  const _COMMANDS_ = {};

  class Command {
    constructor(name) {
      this.name = name;
      __Options__[this.name] = {};
    }

    __field(type, value) {
      if (!value && __Options__[this.name][type]) {
        return __Options__[this.name][type];
      }

      __Options__[this.name][type] = value;

      return this;
    }

    demand(value) {
      return this.__field('demandOption', value);
    }

    description(value) {
      return this.__field('description', value);
    }

    alias(value) {
      return this.__field('alias', value);
    }

    defaults(value) {
      return this.__field('default', value);
    }

    group(value) {
      return this.__field('group', value);
    }

    isDefault(value) {
      return __Options__[this.name]['default'] === value;
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
      //.alias('h', 'help')
      //.alias('v', 'version')
      //.wrap(null)
      .options(__Options__)
      //.hide('source')
      //.describe('help', 'Help')
      //.describe('version', 'Help')
      //.epilog(' Visit https://nightwatchjs.org for more details')
      .argv;
  };

  this.setup = function() {
    // CLI definitions

    // $ nightwatch -e
    // $ nightwatch --env saucelabs
    this.command('env')
      .description('Specify the testing environment to use.')
      .alias('e')
      .defaults('default');

    // $ nightwatch -c
    // $ nightwatch --config
    this.command('config')
      .demand(true)
      .description('Path to configuration file; nightwatch.conf.js or nightwatch.json are read by default if present.')
      .alias('c')
      .defaults('./nightwatch.json');


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
      .alias('f');

    // $ nightwatch -a
    // $ nightwatch --tag
    this.command('tag')
      .description('Only run tests with the given tag.')
      .alias('a');

    // $ nightwatch --skiptags
    this.command('skiptags')
      .group('Running options')
      .description('Skips tests that have the specified tag or tags (comma separated).');

    // $ nightwatch --retries
    this.command('retries')
      .group('Retrying')
      .description('Retries failed or errored testcases up <n> times.');

    // $ nightwatch --suiteRetries
    this.command('suiteRetries')
      .group('Retrying')
      .description('Retries failed or errored testsuites up <n> times.');

    // $ nightwatch -r
    // $ nightwatch --reporter
    this.command('reporter')
      .description('Name of a predefined reporter (e.g. junit) or path to a custom reporter file to use.')
      .alias('r')
      .defaults(DefaultSettings.default_reporter);

    // $ nightwatch -o
    // $ nightwatch --output
    this.command('output')
      .description('Where to save the (JUnit XML) test reports.')
      .alias('o');

    // $ nightwatch --headless
    this.command('headless')
      .description('Launch the browser (Chrome or Firefox) in headless mode.');

    // $ nightwatch --verbose
    this.command('verbose')
      .description('Displays extended HTTP command logging during the test run.');

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
