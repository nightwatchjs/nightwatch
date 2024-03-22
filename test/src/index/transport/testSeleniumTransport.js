const assert = require('assert');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const SeleniumRemote = common.require('transport/selenium-webdriver/selenium.js');
const Concurrency = common.require('runner/concurrency/');
const MockServer = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('Selenium Server Transport', function () {
  const fn = Concurrency.isWorker;
  before(function(done) {
    Concurrency.isWorker = function() {
      return true;
    }

    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    Concurrency.isWorker = fn;
    CommandGlobals.afterEach.call(this, done);
  });

  it('test create Transport with concurrency enabled', function() {
    const client = NightwatchClient.client({
      selenium: {
        port: 10195,
        host: 'localhost',
        start_process: true
      }
    });

    client.settings.selenium['[_started]'] = true;

    const transport = new SeleniumRemote(client);
    assert.strictEqual(client.settings.selenium.start_process, false);
    assert.strictEqual(client.settings.webdriver.start_process, false);
  });


});
