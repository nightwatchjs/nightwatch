const assert = require('assert');
const nock = require('nock');
const Nocks = require('../../lib/nocks.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test Request With Credentials', function () {
  beforeEach(function () {
    Nocks.cleanAll().enable();
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .basicAuth({
        user: 'testusername',
        pass: '123456'
      })
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'firefox',
          version: 'TEST',
          platform: 'TEST'
        }
      });
  });

  afterEach(function () {
    Nocks.deleteSession();
  });

  after(function() {
    Nocks.disable();
  });

  it('Test initialization with credentials', function (done) {
    let client = Nightwatch.createClient({
      selenium_port: 10195,
      silent: false,
      output: false,
      username: 'testusername',
      access_key: '123456'
    });

    client.on('nightwatch:session.create', function (data) {
      assert.equal(data.sessionId, '1352110219202');
      done();
    });

    client.startSession();
  });
});
