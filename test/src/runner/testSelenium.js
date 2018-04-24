const assert = require('assert');
const common = require('../../common.js');
const WDServer = common.require('runner/webdriver-server.js');
const SeleniumServer = common.require('runner/wd-instances/selenium-server.js');
const mockSpawn = require('mock-spawn');
const nock = require('nock');
const Settings = common.require('settings/settings.js');

describe('test Selenium Server', function() {
  beforeEach(function() {
    this.mockedSpawn = mockSpawn();
    this.origPrint = require('util').print;
    this.origSpawn = require('child_process').spawn;

    require('child_process').spawn = this.mockedSpawn;
    require('util').print = function() {
    };

    nock('http://localhost:4444')
      .get('/status')
      .reply(200, {
        status: 0
      });
  });

  afterEach(function() {
    // clean up

    require('child_process').spawn = this.origSpawn;
    require('util').print = this.origPrint;
  });

  it('testStartSeleniumServerDisabled', function() {
    let settings = Settings.parse({
      selenium: {
        start_process: false
      }
    });

    let wdServer = new WDServer(settings);
    assert.strictEqual(wdServer.instance, null);
  });

  it('testStartWebdriverServerDisabled', function() {
    let settings = Settings.parse({
      webdriver: {
        start_process: false
      }
    });

    let wdServer = new WDServer(settings);
    assert.strictEqual(wdServer.instance, null);
  });

  it('testStartServer', function() {
    this.mockedSpawn.setStrategy(function(command, args, opts) {
      assert.deepEqual(opts, {stdio: ['ignore', 'pipe', 'pipe']});
      wdServer.instance.resolved = true;

      if (command !== 'java') {
        return null;
      }
      return function(cb) {
        this.stdout.write('Started org.openqa.jetty.jetty.Server');
        return cb(0); // and exit 0
      };
    });
    let settings = Settings.parse({
      selenium: {
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
      assert.equal(wdServer.instance instanceof SeleniumServer);
      assert.equal(process.command, 'java');
      assert.deepEqual(process.args, ['-DpropName=1', '-Dwebdriver.test.property=test', '-jar', './selenium.jar', '-port', 4444]);
      assert.equal(process.host, undefined);
      assert.equal(process.port, 4444);
      assert.equal(error, null);
    });


    // Selenium.startServer({
    //   selenium: {
    //     start_process: true,
    //     server_path: './selenium.jar',
    //     log_path: false,
    //     cli_args: {
    //       'webdriver.test.property': 'test',
    //       'webdriver.empty.property': '',
    //       '-DpropName': '1'
    //     }
    //   }
    // }, function(error, process) {
    //   assert.equal(process.command, 'java');
    //   assert.deepEqual(process.args, ['-DpropName=1', '-Dwebdriver.test.property=test', '-jar', './selenium.jar', '-port', 4444]);
    //   assert.equal(process.host, undefined);
    //   assert.equal(process.port, 4444);
    //   assert.equal(error, null);
    //   done();
    // });
  });

  it('testStartServerWithOtherHost', function(done) {
    this.mockedSpawn.setStrategy(function(command, args, opts) {
      if (command !== 'java') {
        return null;
      }
      return function(cb) {
        this.stdout.write('Started org.openqa.jetty.jetty.Server');
        return cb(0); // and exit 0
      };
    });

    Selenium.startServer({
      selenium: {
        start_process: true,
        server_path: './selenium.jar',
        log_path: false,
        host: '192.168.0.2',
        port: 1024
      }
    }, function(error, process) {
      assert.deepEqual(process.args, ['-jar', './selenium.jar', '-port', 1024, '-host', '192.168.0.2']);
      assert.equal(process.host, '192.168.0.2');
      assert.equal(process.port, 1024);
      done();
    });
  });

  it('testStartServerWithExitCode', function(done) {
    Selenium.startServer({
      selenium: {
        start_process: true,
        server_path: './selenium.jar',
        log_path: false,
        host: '192.168.0.2',
        port: 1024
      }
    }, function(msg, child, data, code) {
      assert.equal(msg, 'Could not start Selenium.');
      done();
    });
  });
});
