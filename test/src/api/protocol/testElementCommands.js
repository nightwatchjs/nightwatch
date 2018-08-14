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

  it('testElementIdElement invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdElement',
        args: [false, 'id', '#weblogin']
      });
    }, /Error: First argument passed to \.elementIdElement\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdElementPlural invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdElements',
        args: [false, 'id', '#weblogin']
      });
    }, /Error: First argument passed to \.elementIdElements\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdClear invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdClear',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdClear\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdSelected invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdSelected',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdSelected\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdEnabled invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdEnabled',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdEnabled\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdEquals invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdEquals',
        args: [false, 'ELEMENT2']
      });
    }, /Error: First argument passed to \.elementIdEquals\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdAttribute invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdAttribute',
        args: [false, 'test_attr']
      });
    }, /Error: First argument passed to \.elementIdAttribute\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdClick invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        assertion: function (opts) {
        },
        commandName: 'elementIdClick',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdClick\(\) should be a web element ID string\. Received boolean\./);

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

  it('testElementIdCssProperty invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdCssProperty',
        args: [false, 'test_property']
      });
    }, /Error: First argument passed to \.elementIdCssProperty\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdDisplayed invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdDisplayed',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdDisplayed\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdLocation invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdLocation',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdLocation\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdLocationInView invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdLocationInView',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdLocationInView\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdName invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdName',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdName\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdSize invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdSize',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdSize\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdText invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        commandName: 'elementIdText',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdText\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdValueGet invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        assertion: function (opts) {
        },
        commandName: 'elementIdValue',
        args: [false]
      });
    }, /Error: First argument passed to \.elementIdValue\(\) should be a web element ID string\. Received boolean\./);
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

  it('testElementIdValuePost invalid element ID', function () {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        assertion: function (opts) {
        },
        commandName: 'elementIdValue',
        args: [false, 'test']
      });
    }, /Error: First argument passed to \.elementIdValue\(\) should be a web element ID string\. Received boolean\./);
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
