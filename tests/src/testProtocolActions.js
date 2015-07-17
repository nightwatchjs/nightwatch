var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';

module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    this.protocol = require('../../' + BASE_PATH + '/api/protocol.js')(this.client);
    callback();
  },

  testElement : function(test) {
    var protocol = this.protocol;
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.element('id', '#weblogin', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"using":"id","value":"#weblogin"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element');
    });
  },

  testElementIdElement : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdElement('0', 'id', '#weblogin', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"using":"id","value":"#weblogin"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/0/element');
    });
  },

  testElementPlural : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elements('id', '#weblogin', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"using":"id","value":"#weblogin"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/elements');
    });
  },

  testElementIdElementPlural : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdElements('0', 'id', '#weblogin', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"using":"id","value":"#weblogin"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/0/elements');
    });
  },

  testElementActive : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementActive(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/active');
    });
  },

  testElementIdClear : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdClear('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/clear');
    });
  },

  testElementIdSelected : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdSelected('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/selected');
    });
  },

  testElementIdEnabled : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdEnabled('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/enabled');
    });
  },

  testElementIdEquals : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdEquals('ELEMENT1', 'ELEMENT2', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/ELEMENT1/equals/ELEMENT2');
    });
  },

  testElementIdAttribute : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdAttribute('TEST_ELEMENT', 'test_attr', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/test_attr');
    });
  },

  testElementIdClick : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdClick('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/click');
    });
  },

  testElementIdCssProperty : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdCssProperty('TEST_ELEMENT', 'test_property', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/css/test_property');
    });
  },

  testElementIdDisplayed : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdDisplayed('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/displayed');
    });
  },

  testElementIdLocation : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdLocation('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location');
    });
  },

  testElementIdLocationInView : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdLocationInView('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location_in_view');
    });
  },

  testElementIdName : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdName('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/name');
    });
  },

  testElementIdSize : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdSize('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/size');
    });
  },

  testElementIdText : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdText('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/text');
    });
  },

  testElementIdValueGet : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdValue('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/value');
    });
  },

  testElementIdValuePost : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdValue('TEST_ELEMENT', 'test', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"value":["t","e","s","t"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/value');
    });
  },

  testExecuteString : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute('<script>test();</script>', ['arg1'], function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/execute');
    });
  },

  testExecuteFunction : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute(function() {return test();},
        ['arg1'], function callback() {
        test.done();
      });

      test.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
    });
  },

  testExecuteFunctionNoArgs : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute(function() {return test();})
        .on('complete', function() {
          test.done();
        });

      test.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":[]}');
    });
  },

  testExecuteAsync : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute_async('<script>test();</script>', ['arg1'], function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/execute_async');
    });
  },

  testExecuteAsyncFunction : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute_async(function() {return test();},
        ['arg1'], function callback() {
          test.done();
        });

      test.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
    });
  },

  testFrameDefault : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.frame(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
    });
  },

  testFramePost : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.frame('testFrame', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"id":"testFrame"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
    });
  },

  testFrameParent : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.frameParent(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/frame/parent');
    });
  },

  'test mouseButtonClick click left' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick('left', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"button":0}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/click');
    });
  },

  'test mouseButtonClick click right' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick('right', function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":2}');
    });
  },

  'test mouseButtonClick click middle' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick('middle', function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":1}');
    });
  },

  'test mouseButtonClick with callback only' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick(function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonClick with no args' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick();
      command.on('complete', function() {
        test.done();
      });

      test.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonDown click left' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown('left', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"button":0}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/buttondown');
    });
  },

  'test mouseButtonDown click middle' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown('middle', function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":1}');
    });
  },

  'test mouseButtonDown with callback only' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown(function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonUp click right' : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonUp('right', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"button":2}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/buttonup');
    });
  },

  testMoveTo : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.moveTo('testElement', 0, 1, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"element":"testElement","xoffset":0,"yoffset":1}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/moveto');
    });
  },

  testRefresh : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.refresh(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/refresh');
    });
  },

  testBack : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.back(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/back');
    });
  },

  testForward : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.forward(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/forward');
    });
  },

  testDoubleClick : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.doubleClick(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/doubleclick');
    });
  },

  testSessions : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.sessions(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/sessions');
    });
  },

  testSessionGET : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionDefault : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('GET', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionDELETE : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('DELETE', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'DELETE');
      test.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionPOST : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('POST', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session');
    });
  },

  testScreenshot : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.screenshot(false, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/screenshot');
    });
  },

  testStatus : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.status(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/status');
    });
  },

  testSubmit : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.submit('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/submit');
    });
  },

  testTitle : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.title(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/title');
    });
  },

  testWindowHandle : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window_handle(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window_handle');
    });
  },

  testWindowHandlePlural : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window_handles(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window_handles');
    });
  },

  testCloseWindow : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window('DELETE', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'DELETE');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window');
    });
  },

  testSwitchWindow : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window('POST', 'other-window', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"name":"other-window"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window');
    });
  },

  testWindowCommand : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      test.throws(
        function() {
          test.done();
          protocol.window('POST');
        }, 'POST method without a name param throws an error'
      );

      test.throws(
        function() {
          protocol.window('GET');
        }, 'GET method throws an error'
      );

    });
  },

  testWindowSizeErrors : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      test.throws(
        function() {
          protocol.windowSize(function() {});
        }, 'First argument must be a window handle string.'
      );

      test.throws(
        function() {
          protocol.windowSize('current', 'a', 10);
        }, 'Width and height arguments must be passed as numbers.'
      );

      test.throws(
        function() {
          protocol.windowSize('current', 10);
        }, 'Width and height arguments must be passed as numbers.'
      );

      test.throws(
        function() {
          test.done();
          protocol.windowSize('current', 10, 'a');
        }, 'Width and height arguments must be passed as numbers.'
      );
    });
  },

  testWindowSizeGet : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.windowSize('current', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
    });
  },

  testWindowSizePost : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.windowSize('current', 10, 10, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"width":10,"height":10}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
    });
  },

  testAcceptAlert : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.accept_alert(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/accept_alert');
    });
  },

  testDismissAlert : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.dismiss_alert(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/dismiss_alert');
    });
  },

  testGetAlertText: function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.getAlertText(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/alert_text');
    });
  },

  testSetAlertText: function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.setAlertText('prompt text to set', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"text":"prompt text to set"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/alert_text');
    });
  },

  testCookieGet : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('GET', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
    });
  },

  testCookiePost : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('POST', {name: 'test_cookie'}, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"cookie":{"name":"test_cookie"}}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
    });
  },

  testCookieDeleteAll : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('DELETE', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'DELETE');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
    });
  },

  testCookieDeleteOne : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('DELETE', 'test_cookie', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'DELETE');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/cookie/test_cookie');
    });
  },

  testCookieErrors : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      test.throws(
        function() {
          test.done();
          protocol.cookie('POST');
        }, 'POST method without a cookie param throws an error'
      );

      test.throws(
        function() {
          protocol.window('PUT');
        }, 'PUT method throws an error'
      );

    });
  },

  testTimeoutsValid : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.timeouts('script', 1000, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"type":"script","ms":1000}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts');
    });
  },

  testTimeoutsInvalid : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      test.throws(
        function() {
          protocol.timeouts('nonscript', 1000);
        }
      );

      test.throws(
        function() {
          test.done();
          protocol.timeouts('script');
        }
      );
    });
  },

  testTimeoutsAsyncScript : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.timeoutsAsyncScript(1000, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"ms":1000}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts/async_script');
    });
  },

  testTimeoutsImplicitWait : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.timeoutsImplicitWait(1000, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"ms":1000}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts/implicit_wait');
    });
  },

  testKeys : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.keys(['A', 'B'], function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"value":["A","B"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/keys');
    });
  },

  testKeysSingle : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.keys('A', function callback() {
        test.done();
      });

      test.equal(command.data, '{"value":["A"]}');
    });
  },

  testKeysUnicode : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.keys('\uE007', function callback() {
        test.done();
      });

      test.equal(command.data, '{"value":["\\ue007"]}');
    });
  },

  testLog : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.sessionLog('browser', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/log');
    });
  },

  testLogTypes : function(test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.sessionLogTypes(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/log/types');
    });
  },

  testContexts: function (test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function (sessionId) {
      var command = protocol.contexts(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/contexts');
    });
  },

  testCurrentContext: function (test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function (sessionId) {
      var command = protocol.currentContext(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/context');
    });
  },

  testSetContext: function (test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function (sessionId) {
      var command = protocol.setContext('NATIVE',function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"name":"NATIVE"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/context');
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
