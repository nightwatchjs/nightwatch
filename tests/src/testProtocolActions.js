var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';

module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    this.protocol = require('../../' + BASE_PATH + '/api/protocol.js')(this.client);
    callback();
  },

  testElement : function(done) {
    var protocol = this.protocol;
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.element('id', '#weblogin', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element');
    });
  },

  testElementIdElement : function(done) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdElement('0', 'id', '#weblogin', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/0/element');
    });
  },

  testElementPlural : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elements('id', '#weblogin', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/elements');
    });
  },

  testElementIdElementPlural : function(done) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdElements('0', 'id', '#weblogin', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"using":"id","value":"#weblogin"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/0/elements');
    });
  },

  testElementActive : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementActive(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/active');
    });
  },

  testElementIdClear : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdClear('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/clear');
    });
  },

  testElementIdSelected : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdSelected('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/selected');
    });
  },

  testElementIdEnabled : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdEnabled('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/enabled');
    });
  },

  testElementIdEquals : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdEquals('ELEMENT1', 'ELEMENT2', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/ELEMENT1/equals/ELEMENT2');
    });
  },

  testElementIdAttribute : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdAttribute('TEST_ELEMENT', 'test_attr', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/test_attr');
    });
  },

  testElementIdClick : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdClick('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/click');
    });
  },

  testElementIdCssProperty : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdCssProperty('TEST_ELEMENT', 'test_property', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/css/test_property');
    });
  },

  testElementIdDisplayed : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdDisplayed('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/displayed');
    });
  },

  testElementIdLocation : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdLocation('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location');
    });
  },

  testElementIdLocationInView : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdLocationInView('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/location_in_view');
    });
  },

  testElementIdName : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdName('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/name');
    });
  },

  testElementIdSize : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdSize('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/size');
    });
  },

  testElementIdText : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdText('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/text');
    });
  },

  testElementIdValueGet : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdValue('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/attribute/value');
    });
  },

  testElementIdValuePost : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.elementIdValue('TEST_ELEMENT', 'test', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"value":["t","e","s","t"]}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/value');
    });
  },

  testExecuteString : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute('<script>test();</script>', ['arg1'], function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/execute');
    });
  },

  testExecuteFunction : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute(function() {return test();},
        ['arg1'], function callback() {
        done();
      });

      assert.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
    });
  },

  testExecuteFunctionNoArgs : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute(function() {return test();})
        .on('complete', function() {
          done();
        });

      assert.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":[]}');
    });
  },

  testExecuteAsync : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute_async('<script>test();</script>', ['arg1'], function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/execute_async');
    });
  },

  testExecuteAsyncFunction : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.execute_async(function() {return test();},
        ['arg1'], function callback() {
          done();
        });

      assert.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
        'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
    });
  },

  testFrameDefault : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.frame(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
    });
  },

  testFramePost : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.frame('testFrame', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"id":"testFrame"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
    });
  },

  testFrameParent : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.frameParent(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/frame/parent');
    });
  },

  'test mouseButtonClick click left' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick('left', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"button":0}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/click');
    });
  },

  'test mouseButtonClick click right' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick('right', function callback() {
        done();
      });

      assert.equal(command.data, '{"button":2}');
    });
  },

  'test mouseButtonClick click middle' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick('middle', function callback() {
        done();
      });

      assert.equal(command.data, '{"button":1}');
    });
  },

  'test mouseButtonClick with callback only' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick(function callback() {
        done();
      });

      assert.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonClick with no args' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonClick();
      command.on('complete', function() {
        done();
      });

      assert.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonDown click left' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown('left', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"button":0}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/buttondown');
    });
  },

  'test mouseButtonDown click middle' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown('middle', function callback() {
        done();
      });

      assert.equal(command.data, '{"button":1}');
    });
  },

  'test mouseButtonDown with callback only' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonDown(function callback() {
        done();
      });

      assert.equal(command.data, '{"button":0}');
    });
  },

  'test mouseButtonUp click right' : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.mouseButtonUp('right', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"button":2}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/buttonup');
    });
  },

  testMoveTo : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.moveTo('testElement', 0, 1, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"element":"testElement","xoffset":0,"yoffset":1}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/moveto');
    });
  },

  testRefresh : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.refresh(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/refresh');
    });
  },

  testBack : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.back(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/back');
    });
  },

  testForward : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.forward(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/forward');
    });
  },

  testDoubleClick : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.doubleClick(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/doubleclick');
    });
  },

  testSessions : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.sessions(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/sessions');
    });
  },

  testSessionDefault : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {

      var command = protocol.session(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionGETImplicit : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionGETExplicit : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('GET', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionGETImplicitById : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('1352110219203', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219203');
    });
  },

  testSessionGETExplicitById : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('GET', '1352110219203', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219203');
    });
  },

  testSessionDELETE : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('DELETE', function callback() {
        done();
      });

      assert.equal(command.request.method, 'DELETE');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202');
    });
  },

  testSessionDELETEById : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('DELETE', '1352110219203', function callback() {
        done();
      });

      assert.equal(command.request.method, 'DELETE');
      assert.equal(command.request.path, '/wd/hub/session/1352110219203');
    });
  },

  testSessionPOST : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.session('POST', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session');
    });
  },

  testScreenshot : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.screenshot(false, function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/screenshot');
    });
  },

  testStatus : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.status(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/status');
    });
  },

  testSubmit : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.submit('TEST_ELEMENT', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/element/TEST_ELEMENT/submit');
    });
  },

  testTitle : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.title(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/title');
    });
  },

  testWindowHandle : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window_handle(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window_handle');
    });
  },

  testWindowHandlePlural : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window_handles(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window_handles');
    });
  },

  testCloseWindow : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window('DELETE', function callback() {
        done();
      });

      assert.equal(command.request.method, 'DELETE');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window');
    });
  },

  testSwitchWindow : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.window('POST', 'other-window', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"name":"other-window"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window');
    });
  },

  testWindowCommand : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      assert.throws(
        function() {
          done();
          protocol.window('POST');
        }, 'POST method without a name param throws an error'
      );

      assert.throws(
        function() {
          protocol.window('GET');
        }, 'GET method throws an error'
      );

    });
  },

  testWindowSizeErrors : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      assert.throws(
        function() {
          protocol.windowSize(function() {});
        }, 'First argument must be a window handle string.'
      );

      assert.throws(
        function() {
          protocol.windowSize('current', 'a', 10);
        }, 'Width and height arguments must be passed as numbers.'
      );

      assert.throws(
        function() {
          protocol.windowSize('current', 10);
        }, 'Width and height arguments must be passed as numbers.'
      );

      assert.throws(
        function() {
          done();
          protocol.windowSize('current', 10, 'a');
        }, 'Width and height arguments must be passed as numbers.'
      );
    });
  },

  testWindowSizeGet : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.windowSize('current', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
    });
  },

  testWindowSizePost : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.windowSize('current', 10, 10, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"width":10,"height":10}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
    });
  },

  testWindowPositionGet : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.windowPosition('current', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/position');
    });
  },

  testWindowPositionPost : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.windowPosition('current', 10, 10, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"x":10,"y":10}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/position');
    });
  },

  testWindowPositionErrors : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      assert.throws(
        function() {
          protocol.windowPosition(function() {});
        }, 'First argument must be a window handle string.'
      );

      assert.throws(
        function() {
          protocol.windowPosition('current', 'a', 10);
        }, 'Offset arguments must be passed as numbers.'
      );

      assert.throws(
        function() {
          protocol.windowPosition('current', 10);
        }, 'Offset arguments must be passed as numbers.'
      );

      assert.throws(
        function() {
          done();
          protocol.windowPosition('current', 10, 'a');
        }, 'Offset arguments must be passed as numbers.'
      );
    });
  },

  testAcceptAlert : function(done) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.accept_alert(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/accept_alert');
    });
  },

  testDismissAlert : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.dismiss_alert(function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/dismiss_alert');
    });
  },

  testGetAlertText: function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.getAlertText(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/alert_text');
    });
  },

  testSetAlertText: function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.setAlertText('prompt text to set', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"text":"prompt text to set"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/alert_text');
    });
  },

  testCookieGet : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('GET', function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
    });
  },

  testCookiePost : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('POST', {name: 'test_cookie'}, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"cookie":{"name":"test_cookie"}}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
    });
  },

  testCookieDeleteAll : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('DELETE', function callback() {
        done();
      });

      assert.equal(command.request.method, 'DELETE');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
    });
  },

  testCookieDeleteOne : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.cookie('DELETE', 'test_cookie', function callback() {
        done();
      });

      assert.equal(command.request.method, 'DELETE');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie/test_cookie');
    });
  },

  testCookieErrors : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      assert.throws(
        function() {
          done();
          protocol.cookie('POST');
        }, 'POST method without a cookie param throws an error'
      );

      assert.throws(
        function() {
          protocol.window('PUT');
        }, 'PUT method throws an error'
      );

    });
  },

  testTimeoutsValid : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.timeouts('script', 1000, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"type":"script","ms":1000}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts');
    });
  },

  testTimeoutsInvalid : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      assert.throws(
        function() {
          protocol.timeouts('nonscript', 1000);
        }
      );

      assert.throws(
        function() {
          done();
          protocol.timeouts('script');
        }
      );
    });
  },

  testTimeoutsAsyncScript : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.timeoutsAsyncScript(1000, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"ms":1000}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts/async_script');
    });
  },

  testTimeoutsImplicitWait : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.timeoutsImplicitWait(1000, function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"ms":1000}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts/implicit_wait');
    });
  },

  testKeys : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.keys(['A', 'B'], function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"value":["A","B"]}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/keys');
    });
  },

  testKeysSingle : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.keys('A', function callback() {
        done();
      });

      assert.equal(command.data, '{"value":["A"]}');
    });
  },

  testKeysUnicode : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function() {
      var command = protocol.keys('\uE007', function callback() {
        done();
      });

      assert.equal(command.data, '{"value":["\\ue007"]}');
    });
  },

  testLog : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.sessionLog('browser', function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/log');
    });
  },

  testLogTypes : function(done) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.sessionLogTypes(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/log/types');
    });
  },

  testContexts: function (test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function (sessionId) {
      var command = protocol.contexts(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/contexts');
    });
  },

  testCurrentContext: function (test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function (sessionId) {
      var command = protocol.currentContext(function callback() {
        done();
      });

      assert.equal(command.request.method, 'GET');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/context');
    });
  },

  testSetContext: function (test) {
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function (sessionId) {
      var command = protocol.setContext('NATIVE',function callback() {
        done();
      });

      assert.equal(command.request.method, 'POST');
      assert.equal(command.data, '{"name":"NATIVE"}');
      assert.equal(command.request.path, '/wd/hub/session/1352110219202/context');
    });
  }
};
