var protocol = require('../../lib/selenium/protocol.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    callback();
  },

  testElement : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.element.call(client, 'id', '#weblogin', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"using":"id","value":"#weblogin"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element');
    });
  },

  testElementPlural : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elements.call(client, 'id', '#weblogin', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"using":"id","value":"#weblogin"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/elements');
    });
  },

  testElementActive : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementActive.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/active');
    });
  },

  testElementIdClear : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdClear.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/clear');
    });
  },

  testElementIdSelected : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdSelected.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/selected');
    });
  },

  testElementIdEnabled : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdEnabled.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/enabled');
    });
  },

  testElementIdEquals : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdEquals.call(client, 'ELEMENT1', 'ELEMENT2', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/ELEMENT1/equals/ELEMENT2');
    });
  },

  testElementIdAttribute : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdAttribute.call(client, 'TEST_ELEMENT', 'test_attr', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/test_attr');
    });
  },

  testElementIdClick : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdClick.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/click');
    });
  },

  testElementIdCssProperty : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdCssProperty.call(client, 'TEST_ELEMENT', 'test_property', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/css/test_property');
    });
  },

  testElementIdDisplayed : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdDisplayed.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/displayed');
    });
  },

  testElementIdLocation : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdLocation.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location');
    });
  },

  testElementIdLocationInView : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdLocationInView.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location_in_view');
    });
  },

  testElementIdName : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdName.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/name');
    });
  },

  testElementIdSize : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdSize.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/size');
    });
  },

  testElementIdText : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdText.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/text');
    });
  },

  testElementIdValueGet : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdValue.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/value');
    });
  },

  testElementIdValuePost : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.elementIdValue.call(client, 'TEST_ELEMENT', 'test', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"value":["t","e","s","t"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/value');
    });
  },

  testExecuteString : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.execute.call(client, '<script>test();</script>', ['arg1'], function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/execute');
    });
  },

  testExecuteFunction : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.execute.call(client, function() {return test();},
        ['arg1'], function callback() {
        test.done();
      });

      test.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
    });
  },

  testExecuteAsync : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.execute_async.call(client, '<script>test();</script>', ['arg1'], function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/execute_async');
    });
  },

  testExecuteAsyncFunction : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.execute_async.call(client, function() {return test();},
        ['arg1'], function callback() {
          test.done();
        });

      test.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
    });
  },

  testFrameDefault : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.frame.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
    });
  },

  testFramePost : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.frame.call(client, 'testFrame', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"id":"testFrame"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
    });
  },

  'test mouseButtonDown click left' : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.mouseButtonDown.call(client, 'left', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"button":0}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/buttondown');
    });
  },

  'test mouseButtonDown click middle' : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.mouseButtonDown.call(client, 'middle', function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":1}');
    });
  },

  'test mouseButtonDown with callback only' : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.mouseButtonDown.call(client, function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonUp click right' : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.mouseButtonUp.call(client, 'right', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"button":2}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/buttonup');
    });
  },

  testMoveTo : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.moveTo.call(client, 'testElement', 0, 1, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"element":"testElement","xoffset":0,"yoffset":1}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/moveto');
    });
  },

  testRefresh : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.refresh.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/refresh');
    });
  },

  testDoubleClick : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.doubleClick.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, "POST");
      test.equal(command.request.path, '/wd/hub/session/1352110219202/doubleclick');
    });
  },

  testScreenshot : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.screenshot.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/screenshot');
    });
  },

  testStatus : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.status.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/status');
    });
  },

  testSubmit : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.submit.call(client, 'TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/submit');
    });
  },

  testTitle : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.title.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/title');
    });
  },

  testWindowHandle : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.window_handle.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window_handle');
    });
  },

  testWindowHandlePlural : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.window_handles.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window_handles');
    });
  },

  testCloseWindow : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.window.call(client, 'DELETE', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'DELETE');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window');
    });
  },

  testSwitchWindow : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.window.call(client, 'POST', 'other-window', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"name":"other-window"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window');
    });
  },

  testWindowCommand : function(test) {
    var client = this.client;
    this.client.on('selenium:session_create', function(sessionId) {
      test.throws(
        function() {
          test.done();
          protocol.actions.window.call(client, 'POST');
        }, 'POST method without a name param throws an error'
      );

      test.throws(
        function() {
          protocol.actions.window.call(client, 'GET');
        }, 'GET method throws an error'
      );

    });
  },

  testWindowSizeErrors : function(test) {
    var client = this.client;
    this.client.on('selenium:session_create', function(sessionId) {
      test.throws(
        function() {
          protocol.actions.windowSize.call(client, function() {});
        }, 'First argument must be a window handle string.'
      );

      test.throws(
        function() {
          protocol.actions.windowSize.call(client, 'current', 'a', 10);
        }, 'Width and height arguments must be passed as numbers.'
      );

      test.throws(
        function() {
          protocol.actions.windowSize.call(client, 'current', 10);
        }, 'Width and height arguments must be passed as numbers.'
      );

      test.throws(
        function() {
          test.done();
          protocol.actions.windowSize.call(client, 'current', 10, 'a');
        }, 'Width and height arguments must be passed as numbers.'
      );
    });
  },

  testWindowSizeGet : function(test) {
    var client = this.client;
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.windowSize.call(client, 'current', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
    });
  },

  testWindowSizePost : function(test) {
    var client = this.client;
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.windowSize.call(client, 'current', 10, 10, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"width":10,"height":10}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
    });
  },

  testAcceptAlert : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.accept_alert.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/accept_alert');
    });
  },

  testDismissAlert : function(test) {
    var client = this.client;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.dismiss_alert.call(client, function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/dismiss_alert');
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
}
