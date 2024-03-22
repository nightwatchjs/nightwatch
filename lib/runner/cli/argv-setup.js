const path = require('path');
const minimist = require('minimist');

const DefaultSettings = require('../../settings/defaults.js');
const {Logger} = require('../../utils');

module.exports = new (function () {
  /**
   * Based on https://github.com/substack/node-optimist by
   *  James Halliday (mail@substack.net), which has been deprecated
   */
  class ArgvSetup {
    get argv() {
      const argv = minimist(this.__processArgs, this.options);
      argv.$0 = this.$0;

      if (this.demanded._ && argv._.length < this.demanded._) {
        this.fail(`Not enough non-option arguments: got ${argv._.length}, need at least ${this.demanded._}`);
      }

      const missing = [];
      Object.keys(this.demanded).forEach(function (key) {
        if (!argv[key]) {
          missing.push(key);
        }
      });

      if (missing.length) {
        this.fail('Missing required arguments: ' + missing.join(', '));
      }

      return argv;
    }

    constructor(processArgs, cwd = process.cwd()) {
      this.options = {
        alias: {},
        default: {}
      };

      this.__processArgs = processArgs;
      this.usage = null;
      this.demanded = {};
      this.descriptions = {};

      this.$0 = process.argv.slice(0, 2)
        .map(function (x) {
          const b = rebase(cwd, x);

          return x.match(/^\//) && b.length < x.length ? b : x;
        }).join(' ');

      if (process.env._ !== undefined && process.argv[1] === process.env._) {
        this.$0 = process.env._.replace(path.dirname(process.execPath) + '/', '');
      }
    }

    addDefault(key, value) {
      if (typeof key === 'object') {
        Object.keys(key).forEach((k) => {
          this.addDefault(k, key[k]);
        });
      } else {
        this.options.default[key] = value;
      }

      return this;
    }

    isDefault(option, value) {
      return this.options.default[option] && this.options.default[option] === value;
    }

    getDefault(option) {
      return this.options.default[option];
    }

    alias(x, y) {
      if (typeof x === 'object') {
        Object.keys(x).forEach((key) => {
          this.alias(key, x[key]);
        });
      } else {
        this.options.alias[x] = (this.options.alias[x] || []).concat(y);
      }

      return this;
    }

    demand(keys) {
      if (typeof keys == 'number') {
        if (!this.demanded._) {
          this.demanded._ = 0;
        }
        this.demanded._ += keys;
      } else if (Array.isArray(keys)) {
        keys.forEach((key) => {
          this.demand(key);
        });
      } else {
        this.demanded[keys] = true;
      }

      return this;
    }

    showUsage(msg) {
      this.usage = msg;

      return this;
    }

    describe(key, desc, groupName) {
      if (typeof key === 'object') {
        Object.keys(key).forEach((k) => {
          this.describe(k, key[k], groupName);
        });
      } else {
        this.descriptions[key] = {desc, groupName};
      }

      return this;
    }

    option(key, opt) {
      if (typeof key === 'object') {
        Object.keys(key).forEach((k) => {
          this.option(k, key[k]);
        });
      } else {
        if (opt.alias) {
          this.alias(key, opt.alias);
        }

        if (opt.demand) {
          this.demand(key);
        }

        if (typeof opt.defaults !== 'undefined') {
          this.addDefault(key, opt.defaults);
        }

        const desc = opt.describe || opt.description || opt.desc;
        if (desc) {
          this.describe(key, desc, opt.group);
        }
      }

      return this;
    }

    showHelp(fn) {
      if (!fn) {
        fn = console.error;
      }

      fn(this.help());
    }

    help() {
      const keys = Object.keys(this.descriptions);
      const groups = Object.keys(this.descriptions).reduce((prev, key) => {
        const group = this.descriptions[key].groupName || 'Main options';
        prev[group] = prev[group] || [];
        prev[group].push(key);

        return prev;
      }, {});

      const help = [];

      if (this.usage) {
        help.unshift(this.usage.replace(/\$0/g, this.$0), '');
      }

      const switches = keys.reduce((acc, key) => {
        acc[key] = [key].concat(this.options.alias[key] || [])
          .map(function (sw) {
            return (sw.length > 1 ? '--' : '-') + sw;
          })
          .join(', ');

        return acc;
      }, {});

      const switchlen = longest(Object.keys(switches).map(function (s) {
        return switches[s] || '';
      }));

      const desclen = longest(Object.keys(this.descriptions).map((d) => {
        return this.descriptions[d].desc || '';
      }));

      Object.keys(groups).forEach((groupName, index) => {
        const content = ['\n'];
        content.push(Logger.colors.brown(groupName + ':'));

        groups[groupName].forEach(key => {
          const kswitch = switches[key];
          let desc = this.descriptions[key].desc || '';
          const spadding = new Array(Math.max(switchlen - kswitch.length + 3, 0)).join('.');
          const dpadding = new Array(Math.max(desclen - desc.length + 1, 0)).join(' ');

          if (dpadding.length > 0) {
            desc += dpadding;
          }

          const prelude = '  ' + (kswitch) + ' ' + Logger.colors.stack_trace(spadding);

          const extra = [
            this.demanded[key]
              ? '[required]'
              : null,
            this.options.default[key] !== undefined
              ? '[default: ' + JSON.stringify(this.options.default[key]) + ']'
              : null
          ].filter(Boolean).join('  ');

          const body = [desc, extra].filter(Boolean).join('  ');

          content.push(prelude + ' ' + Logger.colors.stack_trace(body));
        });

        help.push(content.join('\n'));
      });

      help.push('\n');

      return help.join('');
    }

    fail(msg) {
      if (msg) {
        console.error(Logger.colors.red(msg) + '\n');
      }

      this.showHelp();

      process.exit(1);
    }

    setup() {
      // CLI definitions
      this.option('source', {
        string: true
      });

      // $ nightwatch -e
      // $ nightwatch --env saucelabs
      this.option('env', {
        description: 'Specify the testing environment to use.',
        alias: 'e',
        defaults: 'default'
      });

      // $ nightwatch -c
      // $ nightwatch --config
      this.option('config', {
        demand: true,
        description: 'Path to configuration file; nightwatch.conf.js or nightwatch.json are read by default if present.',
        alias: 'c',
        defaults: './nightwatch.json'
      });

      // $ nightwatch -t
      // $ nightwatch --test
      this.option('test', {
        description: 'Runs a single test.',
        alias: 't'
      });

      // $ nightwatch --testcase
      this.option('testcase', {
        description: 'Used only together with --test. Runs the specified testcase from the current suite/module.'
      });

      // $ nightwatch --mocha
      this.option('mocha', {
        description: 'Set the test runner to use Mocha.'
      });

      /*
      // $ nightwatch --chrome
      this.option('chrome', {
        group: 'Browsers',
        description: 'Run tests in Google Chrome browser'
      });

      // $ nightwatch --firefox
      this.option('firefox', {
        group: 'Browsers',
        description: 'Run tests in Mozilla Firefox browser'
      });

      // $ nightwatch --safari
      this.option('safari', {
        group: 'Browsers',
        description: 'Run tests in Apple Safari'
      });

      // $ nightwatch --edge
      this.option('edge', {
        group: 'Browsers',
        description: 'Run tests in Microsoft Edge'
      });
      */
      // $ nightwatch -g
      // $ nightwatch --group
      this.option('group', {
        group: 'Tags & filtering',
        description: 'Runs a group of tests (i.e. a folder)',
        alias: 'g'
      });

      // $ nightwatch -s
      // $ nightwatch --skipgroup
      this.option('skipgroup', {
        group: 'Tags & filtering',
        description: 'Skips one or several (comma separated) group of tests.',
        alias: 's'
      });

      // $ nightwatch -f
      // $ nightwatch --filter
      this.option('filter', {
        group: 'Tags & filtering',
        description: 'Specify a filter (glob expression) as the file name format to use when loading the files.',
        alias: 'f'
      });

      // $ nightwatch -a
      // $ nightwatch --tag
      this.option('tag', {
        group: 'Tags & filtering',
        description: 'Only run tests with the given tag.',
        alias: 'a'
      });

      // $ nightwatch --skiptags
      this.option('skiptags', {
        group: 'Tags & filtering',
        description: 'Skips tests that have the specified tag or tags (comma separated).'
      });

      // $ nightwatch --grep
      this.option('grep', {
        group: 'Test Filters – Mocha only',
        description: 'Only run tests matching this string or regexp.'
      });

      // $ nightwatch --fgrep
      this.option('fgrep', {
        group: 'Test Filters – Mocha only',
        description: 'Only run tests containing this string.'
      });

      // $ nightwatch --invert
      this.option('invert', {
        group: 'Test Filters – Mocha only',
        description: 'Inverts --grep and --fgrep matches.'
      });

      // $ nightwatch --retries
      this.option('retries', {
        group: 'Retrying',
        description: 'Retries failed or errored testcases up <n> times.'
      });

      // $ nightwatch --suiteRetries
      this.option('suiteRetries', {
        group: 'Retrying',
        description: 'Retries failed or errored testsuites up <n> times.'
      });

      // $ nightwatch --timeout
      this.option('timeout', {
        description: 'Set the global timeout for assertion retries before an assertion fails.'
      });

      // $ nightwatch -o
      // $ nightwatch --output
      this.option('output', {
        group: 'Reporting',
        description: 'Where to save the (JUnit XML) test reports.',
        alias: 'o'
      });

      // $ nightwatch -r
      // $ nightwatch --reporter
      this.option('reporter', {
        group: 'Reporting',
        description: 'Name of a predefined reporter (e.g. junit) or path to a custom reporter file to use.',
        alias: 'r',
        defaults: DefaultSettings.default_reporter
      });

      // $ nightwatch --trace
      this.option('trace', {
        group: 'Reporting',
        descriptions: 'Record trace information during nightwatch execution.'
      });

      // $ nightwatch --open
      this.option('open', {
        group: 'Reporting',
        description: 'Opens the HTML report generated in the default browser at the end of test run'
      });

      // $ nightwatch --reuse-browser
      this.option('reuse-browser', {
        description: 'Use the same browser session to run the individual test suites'
      });

      // $ nightwatch --parallel
      // this.option('parallel', {
      //   description: 'Enable running the tests in parallel mode, via test workers.'
      // });

      // $ nightwatch --workers=5
      this.option('workers', {
        description: 'Max number of test files running at the same time (default: CPU cores; e.g. workers=4)'
      });

      // $ nightwatch --sequential
      this.option('serial', {
        description: 'Executes tests serially (disables parallel mode)'
      });

      // $ nightwatch --headless
      this.option('headless', {
        description: 'Launch the browser (Chrome, Edge or Firefox) in headless mode.'
      });

      // $ nightwatch --devtools
      this.option('devtools', {
        description: 'Automatically open devtools when launching the browser (Chrome, Edge, or Safari).'
      });

      // $ nightwatch --debug
      this.option('debug', {
        group: 'Component Tests',
        description: 'Automatically pause the test execution after mounting the component and open the Nightwatch debug REPL interface.'
      });

      // $ nightwatch --story
      this.option('story', {
        group: 'Component Tests',
        description: 'Allows to specify which story to run from the current file (when using Storybook or JSX written in component story format)'
      });

      // $ nightwatch --preview
      this.option('preview', {
        group: 'Component Tests',
        description: 'Used to preview a component story/test; automatically pause the test execution after mounting the component.'
      });

      // $ nightwatch --verbose
      this.option('verbose', {
        description: 'Displays extended HTTP command logging during the test run.'
      });

      // $ nightwatch --fail-fast
      this.option('fail-fast', {
        description: 'Run in "fail-fast" mode: if a test suite cannot be started, the rest will be aborted'
      });

      // $ nightwatch -h
      // $ nightwatch --help
      this.option('help', {
        description: 'Shows this help (pass COLORS=0 env variable to disable colors).',
        group: 'Info & help',
        alias: 'h'
      });

      // $ nightwatch --info
      this.option('info', {
        description: 'Shows environment info, i.e. OS, cpu, Node.js and installed browsers.',
        group: 'Info & help'
      });

      // $ nightwatch -v
      // $ nightwatch --version
      this.option('version', {
        alias: 'v',
        group: 'Info & help',
        description: 'Shows version information.'
      });

      // $ nightwatch --list-files
      this.option('list-files', {
        description: 'Shows list of files present in the project.'
      });

      this.option('deviceId', {
        description: 'Set the udid of real iOS device'
      });

      this.option('rerun-failed', {
        description: 'Rerun failed test suites'
      });

      return this;
    }
  }

  function longest(xs) {
    return Math.max.apply(null, xs.map(x => x.length));
  }

  function rebase(base, dir) {
    const ds = path.normalize(dir).split('/').slice(1);
    const bs = path.normalize(base).split('/').slice(1);

    for (var i = 0; ds[i] && ds[i] === bs[i]; i++) {
      ;
    }
    ds.splice(0, i);
    bs.splice(0, i);

    const p = path.normalize(bs.map(function () {
      return '..';
    }).concat(ds).join('/')).replace(/\/$/, '').replace(/^$/, '.');

    return p.match(/^[./]/) ? p : './' + p;
  }

  let __instance__;

  if (!__instance__) {
    __instance__ = new ArgvSetup(process.argv.slice(2));
    __instance__.showUsage(`Usage: ${Logger.colors.cyan('$0 [source] [options]')}`).setup();
  }

  return __instance__;
})();
