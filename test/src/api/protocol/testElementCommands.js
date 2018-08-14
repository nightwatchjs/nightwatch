const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('element actions', function () {
  before(function () {
    Globals.protocolBefore.call(this);
  });

  it('testElement', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element');
        assert.deepEqual(opts.data, {using: 'id', value: '#weblogin'});
      },
      commandName: 'element',
      args: ['id', '#weblogin']
    });
  });

  it('testElementIdElement', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/0/element');
        assert.deepEqual(opts.data, {using: 'id', value: '#weblogin'});
      },
      commandName: 'elementIdElement',
      args: ['0', 'id', '#weblogin']
    });
  });

  it('testElementPlural', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/elements');
        assert.deepEqual(opts.data, {using: 'id', value: '#weblogin'});
      },
      commandName: 'elements',
      args: ['id', '#weblogin']
    });
  });

  it('testElementIdElementPlural', function () {
    return Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/0/elements');
        assert.deepEqual(opts.data, {using: 'id', value: '#weblogin'});
      },
      commandName: 'elementIdElements',
      args: ['0', 'id', '#weblogin']
    });
  });

  it('testElementActive', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/active');
        assert.deepEqual(opts.data, '');
      },
      commandName: 'elementActive',
      args: []
    });
  });

  it('testElementIdClear', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/clear');
        assert.deepEqual(opts.data, '');
      },
      commandName: 'elementIdClear',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdSelected', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/selected');
      },
      commandName: 'elementIdSelected',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdEnabled', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/enabled');
      },
      commandName: 'elementIdEnabled',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdEquals', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/ELEMENT1/equals/ELEMENT2');
      },
      commandName: 'elementIdEquals',
      args: ['ELEMENT1', 'ELEMENT2']
    });
  });

  it('testElementIdAttribute', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/attribute/test_attr');
      },
      commandName: 'elementIdAttribute',
      args: ['TEST_ELEMENT', 'test_attr']
    });
  });

  it('testElementIdClick', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/click');
      },
      commandName: 'elementIdClick',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdCssProperty', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/css/test_property');
      },
      commandName: 'elementIdCssProperty',
      args: ['TEST_ELEMENT', 'test_property']
    });
  });

  it('testElementIdDisplayed', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/displayed');
      },
      commandName: 'elementIdDisplayed',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdLocation', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/location');
      },
      commandName: 'elementIdLocation',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdLocationInView', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/location_in_view');
      },
      commandName: 'elementIdLocationInView',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdName', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/name');
      },
      commandName: 'elementIdName',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdSize', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/size');
      },
      commandName: 'elementIdSize',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdText', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/text');
      },
      commandName: 'elementIdText',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdValueGet', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/attribute/value');
      },
      commandName: 'elementIdValue',
      args: ['TEST_ELEMENT']
    });
  });

  it('testElementIdValuePost', function () {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/value');
      },
      commandName: 'elementIdValue',
      args: ['TEST_ELEMENT', 'test']
    });
  });

  it('testElementWithCallbackAndContext', function (done) {
    Globals.protocolTest.call(this, {
      assertion: function (opts) {},
      commandName: 'element',
      args: ['css selector', 'body', function() {
        try {
          assert.equal(typeof this.pause, 'function');
          done();
        } catch (err) {
          done(err);
        }
      }]
    });

  });
});
