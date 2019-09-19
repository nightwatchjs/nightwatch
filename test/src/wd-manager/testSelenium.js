const assert = require('assert');
const mockSpawn = require('mock-spawn');
const nock = require('nock');
const common = require('../../common.js');
const WDServer = common.require('runner/webdriver-server.js');
const SeleniumServer = common.require('runner/wd-instances/selenium-server.js');
const Settings = common.require('settings/settings.js');

describe('Webdriver Manager', function () {
  describe('test Selenium Server', function () {
    beforeEach(function () {
      this.mockedSpawn = mockSpawn();
      this.origPrint = require('util').print;
      this.origSpawn = require('child_process').spawn;

      require('child_process').spawn = this.mockedSpawn;
      require('util').print = function () {};

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
        wdServer.instance.processCreated = true;

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
          check_process_delay: 10,
          max_status_poll_tries: 7,
          status_poll_interval: 250,
          process_create_timeout: 1000,
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

        assert.strictEqual(wdServer.settings.selenium.max_status_poll_tries, 7);
        assert.strictEqual(wdServer.settings.selenium.status_poll_interval, 250);
        assert.strictEqual(wdServer.settings.selenium.check_process_delay, 10);
        assert.strictEqual(wdServer.settings.selenium.process_create_timeout, 1000);
        assert.strictEqual(wdServer.settings.webdriver.max_status_poll_tries, 7);
        assert.strictEqual(wdServer.settings.webdriver.status_poll_interval, 250);
        assert.strictEqual(wdServer.settings.webdriver.check_process_delay, 10);
        assert.strictEqual(wdServer.settings.webdriver.process_create_timeout, 1000);
        assert.strictEqual(wdServer.instance.process.host, undefined);
        assert.strictEqual(wdServer.instance.pollStarted, true);
        assert.strictEqual(wdServer.instance.processCreated, true);
        assert.strictEqual(wdServer.instance.process.command, 'java');
        assert.strictEqual(wdServer.instance.sessionsEndpoint, '/sessions');
        assert.strictEqual(wdServer.instance.singleSessionEndpoint, '/session');
        assert.strictEqual(wdServer.instance.output, 'Started org.openqa.jetty.jetty.Server');
        assert.strictEqual(wdServer.instance.error_out, '');
      });
    });

    it('testStartServerWithExitCode', function () {
      this.mockedSpawn.setStrategy(function (command, args, opts) {
        assert.deepEqual(opts, {stdio: ['ignore', 'pipe', 'pipe']});

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
          process_create_timeout: 2000,
          start_process: true,
          server_path: './selenium.jar',
          log_path: false,
          port: 1024
        }
      });

      let wdServer = new WDServer(settings);

      return wdServer.start().then(_ => {
        // Simulate an error thrown
        assert.ok(false, 'Selenium Server should have failed to start.');
      }).catch(err => {
        assert.strictEqual(wdServer.settings.webdriver.max_status_poll_tries, 15);
        assert.strictEqual(wdServer.settings.webdriver.status_poll_interval, 200);
        assert.strictEqual(wdServer.settings.webdriver.check_process_delay, 1000);
        assert.strictEqual(wdServer.settings.webdriver.process_create_timeout, 2000);
        assert.ok(err.message.includes('Selenium Server process exited with code: 1'));
      });
    });

    it('test start server with timeout', function () {
      this.mockedSpawn.setStrategy(function (command, args, opts) {
        if (command !== 'java') {
          return null;
        }
      });

      let settings = Settings.parse({
        selenium: {
          check_process_delay: 10,
          start_process: true,
          status_poll_interval: 10,
          max_status_poll_tries: 3,
          server_path: './selenium.jar',
          log_path: false,
          port: 1024
        }
      });

      let wdServer = new WDServer(settings);

      return wdServer.start().then(_ => {
        // Simulate an error thrown
        assert.ok(false, 'Selenium Server should have failed to start.');
      }).catch(err => {
        assert.strictEqual(wdServer.instance.statusPingTries, 3);
        assert.ok(err.message.includes('Timeout while trying to connect to Selenium Server on port 1024.'));
      });
    });
  });
});
