const {expect} = require('chai');
const {MockServer} = require('../../../lib/mockserver.js');
const {runTests} = require('../../../lib/testrunner.js');

describe('Scroll Commands', function() {
  before(function(done) {
    MockServer.start();
    done();
  });

  after(function(done) {
    MockServer.stop();
    done();
  });

  it('scrollToBottom', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: null
      })
    });

    runTests({
      src_folders: ['test/src/api/commands/window'],
      test_settings: {
        default: {
          launch_url: 'http://localhost:10195',
          selenium_port: 10195,
          selenium_host: 'localhost',
          silent: true,
          output: false,
          desiredCapabilities: {
            browserName: 'chrome',
            javascriptEnabled: true,
            acceptSslCerts: true,
            platform: 'ANY'
          }
        }
      }
    }, {
      reporter: function(results) {
        expect(results.passed).to.equal(1);
        expect(results.failed).to.equal(0);
        expect(results.errors).to.equal(0);
        done();
      }
    });
  });

  it('scrollToTop', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: null
      })
    });

    runTests({
      src_folders: ['test/src/api/commands/window'],
      test_settings: {
        default: {
          launch_url: 'http://localhost:10195',
          selenium_port: 10195,
          selenium_host: 'localhost',
          silent: true,
          output: false,
          desiredCapabilities: {
            browserName: 'chrome',
            javascriptEnabled: true,
            acceptSslCerts: true,
            platform: 'ANY'
          }
        }
      }
    }, {
      reporter: function(results) {
        expect(results.passed).to.equal(1);
        expect(results.failed).to.equal(0);
        expect(results.errors).to.equal(0);
        done();
      }
    });
  });

  it('scrollIntoView', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: null
      })
    });

    runTests({
      src_folders: ['test/src/api/commands/window'],
      test_settings: {
        default: {
          launch_url: 'http://localhost:10195',
          selenium_port: 10195,
          selenium_host: 'localhost',
          silent: true,
          output: false,
          desiredCapabilities: {
            browserName: 'chrome',
            javascriptEnabled: true,
            acceptSslCerts: true,
            platform: 'ANY'
          }
        }
      }
    }, {
      reporter: function(results) {
        expect(results.passed).to.equal(1);
        expect(results.failed).to.equal(0);
        expect(results.errors).to.equal(0);
        done();
      }
    });
  });

  it('scrollUntilText', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    });

    runTests({
      src_folders: ['test/src/api/commands/window'],
      test_settings: {
        default: {
          launch_url: 'http://localhost:10195',
          selenium_port: 10195,
          selenium_host: 'localhost',
          silent: true,
          output: false,
          desiredCapabilities: {
            browserName: 'chrome',
            javascriptEnabled: true,
            acceptSslCerts: true,
            platform: 'ANY'
          }
        }
      }
    }, {
      reporter: function(results) {
        expect(results.passed).to.equal(1);
        expect(results.failed).to.equal(0);
        expect(results.errors).to.equal(0);
        done();
      }
    });
  });
}); 