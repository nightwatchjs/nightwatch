const assert = require('assert');
const {By, WebElement} = require('selenium-webdriver');
const Globals = require('../../../lib/globals.js');

describe('element actions', function () {
  describe('.element() with backwards compat mode', function() {
    before(function (done) {
      Globals.protocolBefore({
        backwards_compatibility_mode: true
      }, done);
    });

    after((done) => Globals.protocolAfter(done));

    it('testElement', function () {
      return Globals.protocolTest({
        assertion({locator, command}) {
          assert.ok(locator instanceof By);
          assert.strictEqual(locator.using, 'css selector');
          assert.strictEqual(command, 'findElement');
        },
        commandName: 'element',
        args: ['css selector', '#weblogin', function(result) {
          assert.deepStrictEqual(result.value, {
            'element-6066-11e4-a52e-4f735466cecf': '12345-6789'
          });
          assert.strictEqual(result.status, 0);
        }]
      });
    });
  });

  describe('elements', function() {
    const warn = console.warn;
    before(function () {
      Globals.protocolBefore();
    });

    afterEach(() => {
      console.warn = warn;
    });

    after((done) => Globals.protocolAfter(done));

    it('testMultipleElements', function () {
      return Globals.protocolTest({
        assertion({locator, command}) {
          assert.ok(locator instanceof By);
          assert.strictEqual(command, 'findElements');
        },
        commandName: 'elements',
        args: ['id', '#weblogin', function({value, status}) {
          assert.strictEqual(status, 0);
          assert.deepStrictEqual(value, [{'element-6066-11e4-a52e-4f735466cecf': '12345-6789'}]);
        }]
      });
    });

    it('testMultipleElements with no results', function () {
      return Globals.protocolTest({
        commandName: 'elements',
        args: ['id', '#weblogin', function({value, status, error}) {
          assert.deepStrictEqual(value, []);
        }],
        mockDriverOverrides: {
          findElements(locator) {
            return [];
          }
        }
      });
    });

    it('testElementIdElement', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.ok(args.id instanceof WebElement);
          assert.strictEqual(command, 'findChildElement');
        },
        commandName: 'elementIdElement',
        args: ['0', 'id', '#weblogin', function({value, status, elementId}) {
          assert.strictEqual(status, 0);
          assert.deepStrictEqual(value, {'element-6066-11e4-a52e-4f735466cecf': '6789-192111'});
          assert.strictEqual(elementId, '6789-192111');
        }]
      });
    });

    it('testElementIdElement invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdElement',
        args: [false, 'id', '#weblogin']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdElement" command: First argument passed to .elementIdElement() should be a web element ID string. Received boolean.');
      });
    });

    it('testElementIdElementPlural', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(command, 'findChildElements');
          assert.ok(args.id instanceof WebElement);
        },
        commandName: 'elementIdElements',
        args: ['0', 'id', '#weblogin', function({value, status}) {
          assert.strictEqual(status, 0);
          assert.deepStrictEqual(value, [{'element-6066-11e4-a52e-4f735466cecf': '6789-192111'}]);
        }]
      });
    });

    it('testElementIdElementPlural invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdElements',
        args: [false, 'id', '#weblogin']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdElements" command: First argument passed to .elementIdElements() should be a web element ID string. Received boolean.');
      });
    });

    it('testElementActive', function () {
      return Globals.protocolTest({
        assertion({command}) {
          assert.strictEqual(command, 'activeElement');
        },
        commandName: 'elementActive',
        args: [function(result) {
          assert.deepStrictEqual(result, {value: '12345-6789', status: 0});
        }]
      });
    });

    it('testElementIdClear', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(command, 'clearElement');
        },
        commandName: 'elementIdClear',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: null, status: 0});
        }]
      });
    });

    it('testElementIdClear invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdClear',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdClear" command: First argument passed to .elementIdClear() should be a web element ID string. Received boolean.');

        return true;
      }).then((result) => {
        assert.strictEqual(result, true);
      });
    });

    it('testElementIdSelected', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(command, 'isElementSelected');
          assert.ok(args.id instanceof WebElement);
        },
        commandName: 'elementIdSelected',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: true, status: 0});
        }]
      });
    });

    it('testElementIdSelected invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdSelected',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdSelected" command: First argument passed to .elementIdSelected() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdEnabled', function () {
      return Globals.protocolTest({
        assertion: function ({args, command}) {
          assert.strictEqual(command, 'isElementEnabled');
          assert.ok(args.id instanceof WebElement);
        },
        commandName: 'elementIdEnabled',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: true, status: 0});
        }]
      });
    });

    it('testElementIdEnabled invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdEnabled',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdEnabled" command: First argument passed to .elementIdEnabled() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdEquals', function () {
      console.warn = function(value) {
        assert.ok(value.includes('Please use WebElement.equals(a, b) instead from Selenium Webdriver.'));
      };

      return Globals.protocolTest({
        assertion: function (opts) {
          assert.strictEqual(opts.path, '/session/1352110219202/element/ELEMENT1/equals/ELEMENT2');
        },
        commandName: 'elementIdEquals',
        args: ['ELEMENT1', 'ELEMENT2', function(res) {
          assert.strictEqual(res.status, 0);
        }]
      });
    });

    it('testElementIdEquals invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdEquals',
        args: [false, 'ELEMENT2']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdEquals" command: First argument passed to .elementIdEquals() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdAttribute', function () {
      return Globals.protocolTest({
        assertion({path}) {
          assert.strictEqual(path, '/session/1352110219202/element/TEST_ELEMENT/attribute/test_attr');
          // assert.strictEqual(args.name, 'test_attr');
          // assert.ok(args.id instanceof WebElement);
          // assert.strictEqual(command, 'getElementAttribute');
        },
        commandName: 'elementIdAttribute',
        args: ['TEST_ELEMENT', 'test_attr', function(result) {
          
        }]
      });
    });

    it('testElementIdAttribute invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdAttribute',
        args: [false, 'test_attr']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdAttribute" command: First argument passed to .elementIdAttribute() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdClick', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(command, 'clickElement');
        },
        commandName: 'elementIdClick',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: null, status: 0});
        }]
      });
    });

    it('testElementIdClick invalid element ID', function () {
      return Globals.protocolTest({
        assertion: function (opts) {
        },
        commandName: 'elementIdClick',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdClick" command: First argument passed to .elementIdClick() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdCssProperty', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(args.propertyName, 'test_property');
          assert.strictEqual(command, 'getElementValueOfCssProperty');
        },
        commandName: 'elementIdCssProperty',
        args: ['TEST_ELEMENT', 'test_property', function(result) {
          assert.deepStrictEqual(result, {value: '', status: 0});
        }]
      });
    });

    it('testElementIdCssProperty invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdCssProperty',
        args: [false, 'test_property']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdCssProperty" command: First argument passed to .elementIdCssProperty() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdProperty', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(args.name, 'test_property');
          assert.strictEqual(command, 'getElementProperty');
        },
        commandName: 'elementIdProperty',
        args: ['TEST_ELEMENT', 'test_property', function(result) {
          assert.deepStrictEqual(result, {value: 'test_prop_value', status: 0});
        }]
      });
    });

    it('testElementIdProperty invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdProperty',
        args: [false, 'test_property']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdProperty" command: First argument passed to .elementIdProperty() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdDisplayed', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.ok(args.id instanceof WebElement);
          assert.strictEqual(command, 'isElementDisplayed');
        },
        commandName: 'elementIdDisplayed',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: true, status: 0});
        }]
      });
    });

    it('testElementIdDisplayed invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdDisplayed',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdDisplayed" command: First argument passed to .elementIdDisplayed() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdLocation', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.ok(args.id instanceof WebElement);
          assert.strictEqual(command, 'getElementRect');
        },
        commandName: 'elementIdLocation',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {status: 0, value: {width: 100, height: 105, x: 10, y: 15}});
        }]
      });
    });

    it('testElementIdLocation invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdLocation',
        args: [false]
      })
        .catch(err => {
          assert.strictEqual(err.message, 'Error while running "elementIdLocation" command: First argument passed to .elementIdLocation() should be a web element ID string. Received boolean.');

          return true;
        }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdLocationInView', function () {
      console.warn = function(text) {
        assert.ok(text.includes('This command has been deprecated and is removed from the W3C Webdriver standard.'));
      };

      return Globals.protocolTest({
        assertion: function (opts) {
          assert.strictEqual(opts.path, '/session/1352110219202/element/TEST_ELEMENT/location_in_view');
        },
        commandName: 'elementIdLocationInView',
        args: ['TEST_ELEMENT', function(result) {
          assert.strictEqual(result.status, 0);
        }]
      });
    });

    it('testElementIdLocationInView invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdLocationInView',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdLocationInView" command: First argument passed to .elementIdLocationInView() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdName', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.ok(args.id instanceof WebElement);
          assert.strictEqual(command, 'getElementTagName');
        },
        commandName: 'elementIdName',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: 'div', status: 0});
        }]
      });
    });

    it('testElementIdName invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdName',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdName" command: First argument passed to .elementIdName() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdSize', function () {
      console.warn = function(value) {
        assert.ok(value.includes('Please use .getElementRect().'));
      };

      return Globals.protocolTest({
        assertion({command}) {
          assert.strictEqual(command, 'getElementRect');
        },
        commandName: 'elementIdSize',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {
            status: 0,
            value: {
              height: 105,
              width: 100,
              x: 10,
              y: 15
            }
          });
        }]
      });
    });

    it('testElementIdSize invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdSize',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdSize" command: First argument passed to .elementIdSize() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });

    it('testElementIdText', function () {
      return Globals.protocolTest({
        assertion({args, command}) {
          assert.strictEqual(command, 'getElementText');
        },
        commandName: 'elementIdText',
        args: ['TEST_ELEMENT', function(result) {
          assert.deepStrictEqual(result, {value: 'text', status: 0});
        }]
      });
    });

    it('testElementIdText invalid element ID', function () {
      return Globals.protocolTest({
        commandName: 'elementIdText',
        args: [false]
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdText" command: First argument passed to .elementIdText() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));

    });

    it('testElementIdValueGet', function () {
      console.warn = function(value) {
        assert.ok(value.includes('This command has been deprecated and is removed from the W3C Webdriver standard. It is only working with legacy Selenium JSONWire protocol.'));
      };

      return Globals.protocolTest({
        assertion({path}) {
          assert.strictEqual(path, '/session/1352110219202/element/TEST_ELEMENT/attribute/value');
        },
        commandName: 'elementIdValue',
        args: ['TEST_ELEMENT', function(result) {

        }]
      });
    });

    it('testElementIdValuePost', function () {
      const assertions = [];

      return Globals.protocolTest({
        assertion({args, command}) {
          assertions.push({args, command});
        },
        commandName: 'elementIdValue',
        args: ['TEST_ELEMENT', 'test', function(result) {
          assert.strictEqual(assertions[0].command, 'clearElement');
          assert.ok(assertions[0].args.id instanceof WebElement);

          assert.strictEqual(assertions[1].command, 'sendKeysToElement');
          assert.strictEqual(assertions[1].args.text, 'test');
          assert.deepStrictEqual(assertions[1].args.value, ['t', 'e', 's', 't']);
          assert.ok(assertions[1].args.id instanceof WebElement);

          assert.deepStrictEqual(result, {value: null, status: 0});
        }]
      });
    });

    it('testElementIdValuePost invalid element ID', function () {
      return Globals.protocolTest({
        assertion: function (opts) {
        },
        commandName: 'elementIdValue',
        args: [false, 'test']
      }).catch(err => {
        assert.strictEqual(err.message, 'Error while running "elementIdValue" command: First argument passed to .elementIdValue() should be a web element ID string. Received boolean.');

        return true;
      }).then(result => assert.strictEqual(result, true));
    });
  });
});
