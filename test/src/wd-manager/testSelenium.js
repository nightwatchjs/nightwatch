const assert = require('assert');
const common = require('../../common.js');
const WDServer = common.require('runner/webdriver-server.js');
const SeleniumServer = common.require('runner/wd-instances/selenium-server.js');
const mockSpawn = require('mock-spawn');
const nock = require('nock');
const Settings = common.require('settings/settings.js');

describe('Webdriver Manager', function () {
  describe('test Selenium Server', function () {
    beforeEach(function () {
      this.mockedSpawn = mockSpawn();
      this.origPrint = require('util').print;
      this.origSpawn = require('child_process').spawn;

      require('child_process').spawn = this.mockedSpawn;
      require('util').print = function () {
      };

      try {
        nock.activate();
      } catch (err) {}

      nock('http://localhost:4444')
        .get('/status')
        .reply(200, {
          status: 0
        });
    });

    afterEach(function () {
      // clean up

      require('child_process').spawn = this.origSpawn;
      require('util').print = this.origPrint;
    });

    after(function() {
      nock.restore();
    });

    it('testStartSeleniumServerDisabled', function () {
      let settings = Settings.parse({
        selenium: {
          start_process: false
        }
      });

      let wdServer = new WDServer(settings);
      assert.strictEqual(wdServer.instance, null);
    });

    it('testStartWebdriverServerDisabled', function () {
      let settings = Settings.parse({
        webdriver: {
          start_process: false
        }
      });

      let wdServer = new WDServer(settings);
      assert.strictEqual(wdServer.instance, null);
    });

    it('testStartServer', function () {
      this.mockedSpawn.setStrategy(function (command, args, opts) {
        assert.deepEqual(opts, {stdio: ['ignore', 'pipe', 'pipe']});
        wdServer.instance.resolved = true;

        if (command !== 'java') {
          return null;
        }

        return function (cb) {
          this.stdout.write('Started org.openqa.jetty.jetty.Server');

          return cb(0); // and exit 0
        };
      });

      let settings = Settings.parse({
        selenium: {
          check_process_delay: 100,
          start_process: true,
          server_path: './selenium.jar',
          log_path: false,
          cli_args: {
            'webdriver.test.property': 'test',
            'webdriver.empty.property': '',
            '-DpropName': '1'
          }
        }
      });

      let wdServer = new WDServer(settings);

      return wdServer.start().then(_ => {
        assert.ok(wdServer.instance instanceof SeleniumServer);

        assert.deepEqual(wdServer.instance.cliArgs, [
          '-DpropName=1',
          '-Dwebdriver.test.property=test',
          '-jar',
          './selenium.jar',
          '-port',
          4444
        ]);

        assert.equal(wdServer.instance.process.host, undefined);
        assert.equal(wdServer.instance.pollStarted, true);
        assert.equal(wdServer.instance.resolved, true);
        assert.equal(wdServer.instance.process.command, 'java');
        assert.equal(wdServer.instance.sessionsEndpoint, '/sessions');
        assert.equal(wdServer.instance.singleSessionEndpoint, '/session');
        assert.equal(wdServer.instance.output, 'Started org.openqa.jetty.jetty.Server');
        assert.strictEqual(wdServer.instance.error_out, '');
      });
    });

    it('testStartServerWithExitCode', function () {
      this.mockedSpawn.setStrategy(function (command, args, opts) {
        assert.deepEqual(opts, {stdio: ['ignore', 'pipe', 'pipe']});
        wdServer.instance.resolved = true;

        if (command !== 'java') {
          return null;
        }

        return function (cb) {
          this.stderr.write('Error starting Selenium.');

          return cb(1);
        };
      });

      let settings = Settings.parse({
        selenium: {
          check_process_delay: 1000,
          start_process: true,
          server_path: './selenium.jar',
          log_path: false,
          port: 1024
        }
      });

      let wdServer = new WDServer(settings);

      return wdServer.start().then(_ => {
        assert.ok(false, 'Selenium Server should have failed to start.');
      }).catch(err => {
        assert.ok(err.message.includes('Selenium Server process exited with code: 1'));
      });
    });
  });
});