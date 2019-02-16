const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const common = require('../../../common.js');
const Logger = common.require('util/logger.js');

describe('element base commands', function() {
  before(function(done) {
    Logger.enable();
    Logger.setOutputEnabled();
    Nightwatch.startMockServer(done);
  });

  after(function(done) {
    Nightwatch.stop(done);
  });

  it('client.element()', async function() {
    await Nightwatch.initAsync({
      output: true,
      silent: false
    });

    Nightwatch.api()
      .element('css selector', '#weblogin', function callback(result) {
        assert.equal(result.status, 0);
        assert.deepEqual(result.value, { ELEMENT: '0' });
      });

    return Nightwatch.start();
  });

  it('client.elements()', async function() {
    await Nightwatch.initAsync({
      output: true,
      silent: false
    });

    Nightwatch.api()
      .elements('css selector', '#weblogin', function callback(result) {
        assert.equal(result.status, 0);
        assert.deepEqual(result.value, [ { ELEMENT: '0' } ]);
      });

    return Nightwatch.start();
  });

  it('client.element() W3C Webdriver prototcol', async function() {
    await Nightwatch.initAsync({
      output: true,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    Nightwatch.api()
      .element('css selector', '#webdriver', function callback(result) {
        assert.equal(typeof result.status, 'undefined');
        assert.deepEqual(result.value, { 'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b' });
      });

    return Nightwatch.start();
  });

  it('client.elements() W3C Webdriver prototcol', async function() {
    await Nightwatch.initAsync({
      output: true,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    Nightwatch.api()
      .elements('css selector', '#webdriver', function callback(result) {
        assert.equal(typeof result.status, 'undefined');
        assert.deepEqual(result.value, { 'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b' });
      });

    return Nightwatch.start();
  });

  it('client.element() with xpath', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/element',
      postdata: JSON.stringify({
        using: 'xpath',
        value: '//weblogin'
      }),
      response : {
        value: {
          "element-6066-11e4-a52e-4f735466cecf": "5cc459b8-36a8-3042-8b4a-258883ea642b"
        }
      }
    }, true);

    await Nightwatch.initAsync({
      output: true,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    Nightwatch.api()
      .element('xpath', '//weblogin', function callback(result) {
        assert.deepEqual(result.value, {
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        });
      });

    return Nightwatch.start();
  });
});
