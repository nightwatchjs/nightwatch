module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    this.protocol = require('../../lib/selenium/protocol.js')(this.client);
    callback();
  },

  testElement : function(test) {
    var client = this.client;
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

  testElementPlural : function(test) {
    var client = this.client;
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

  testElementActive : function(test) {
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdValue('TEST_ELEMENT', function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/value');
    });
  },

  testElementIdValuePost : function(test) {
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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

  testExecuteAsync : function(test) {
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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

  'test mouseButtonDown click left' : function(test) {
    var client = this.client;
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
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown('middle', function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":1}');
    });
  },

  'test mouseButtonDown with callback only' : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown(function callback() {
        test.done();
      });

      test.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonUp click right' : function(test) {
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.refresh(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/refresh');
    });
  },

  testDoubleClick : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.doubleClick(function callback() {
        test.done();
      });

      test.equal(command.request.method, "POST");
      test.equal(command.request.path, '/wd/hub/session/1352110219202/doubleclick');
    });
  },

  testScreenshot : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.screenshot(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/screenshot');
    });
  },

  testStatus : function(test) {
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.dismiss_alert(function callback() {
        test.done();
      });

      test.equal(command.request.method, 'POST');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/dismiss_alert');
    });
  },

  testCookieGet : function(test) {
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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
    var client = this.client;
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

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
}
