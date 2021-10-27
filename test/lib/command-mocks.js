const MockServer = require('./mockserver.js');

let server;
module.exports = {
  start(done) {
    server = MockServer.init();
    server.on('listening', function () {
      done();
    });
  },

  stop(done) {
    if (!server) {
      done();

      return;
    }

    server.close(function () {
      done();
    });
  },

  createServer(opts = {}) {
    return MockServer.initAsync(opts);
  },

  cookiesFound() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: [{
          name: 'test_cookie',
          value: '123456',
          path: '/',
          domain: 'example.org',
          secure: false
        }]
      }
    }, null, true);
  },

  cookiesNotFound() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: []
      })
    });
  },

  cookiesSocketDelay() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      socketDelay: 200,
      response: ''
    }, true);
  },

  deleteCookie() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie/other_cookie',
      method: 'DELETE',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });
  },

  addCookie() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'POST',
      postdata: JSON.stringify(
        {
          cookie: {
            name: 'other_cookie',
            value: '123456',
            secure: false,
            httpOnly: false
          }
        }
      ),
      response: JSON.stringify({
        value: null
      })
    });
  },

  elementSelected(elementId = '0') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/selected`,
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: true,
        status: 0
      })
    }, true);
  },

  element({using = 'css selector', value = '#container'}) {
    MockServer.addMock({
      url: '/wd/hub/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using, value}),

      response: JSON.stringify({
        value: [{
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }]
      })
    }, true);
  },

  elementNotSelected(elementId = '0') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/selected`,
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: false,
        status: 0
      })
    }, true);
  },

  maximizeWindow() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/window/current/maximize',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);
  },

  elementText(elementId = '0', text = 'sample text') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/text`,
      method: 'GET',
      response: JSON.stringify({
        sessiondId: '1352110219202',
        status: 0,
        value: text
      })
    });
  },

  tagName(elementId = '0', tagName = 'div') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/name`,
      method: 'GET',
      response: JSON.stringify({
        value: tagName
      })
    });
  },

  visible(elementId = '0', value = true, {times = 0} = {}) {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/displayed`,
      method: 'GET',
      response: JSON.stringify({
        value
      }),
      times
    });
  },

  createFirefoxSession({
    persist = false,
    sessionId = '13521-10219-202',
    headless = true,
    deleteSession = true,
    url = '/wd/hub/session'
  }) {
    const browserName = 'firefox';
    const headlessOpt = headless ? '-headless' : '';
    const options = {
      ['moz:firefoxOptions']: {
        args: [headlessOpt]
      }
    };

    MockServer.addMock({
      url,
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify({
        desiredCapabilities: {browserName, ...options},
        capabilities: {alwaysMatch: {browserName, ...options}}
      }),

      response: JSON.stringify({
        value: {
          sessionId,
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'firefox',
            browserVersion: '65.0.1'
          }
        }
      })
    }, !persist);

    if (!deleteSession) {
      return;
    }

    MockServer.addMock({
      url: `/session/${sessionId}`,
      method: 'DELETE',
      response: {
        value: null
      }
    }, !persist);
  },

  createChromeSession({
    persist = false,
    sessionId = '13521-10219-202',
    headless = true,
    deleteSession = true,
    url = '/wd/hub/session'
  }) {
    const browserName = 'chrome';
    const headlessOpt = headless ? 'headless' : '';
    const options = {
      ['goog:chromeOptions']: {}
    };

    if (headlessOpt) {
      options['goog:chromeOptions'].args = [headlessOpt];
    }

    MockServer.addMock({
      url,
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify({
        desiredCapabilities: {browserName, ...options},
        capabilities: {alwaysMatch: {browserName, ...options}}
      }),

      response: JSON.stringify({
        value: {
          sessionId,
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'chrome',
            browserVersion: '90'
          }
        }
      })
    }, !persist);

    if (!deleteSession) {
      return;
    }

    MockServer.addMock({
      url: `/session/${sessionId}`,
      method: 'DELETE',
      response: {
        value: null
      }
    }, !persist);
  },

  createNewW3CSession({
    testName = '',
    browserName = 'firefox',
    sessionId = '13521-10219-202',
    persist = false,
    deleteSession = true
  } = {}) {
    MockServer.addMock({
      url: '/session',
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify({
        desiredCapabilities: {browserName, name: testName},
        capabilities: {alwaysMatch: {browserName}}
      }),

      response: JSON.stringify({
        value: {
          sessionId,
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'firefox',
            browserVersion: '65.0.1'
          }
        }
      })
    }, !persist);

    if (!deleteSession) {
      return;
    }

    MockServer.addMock({
      url: `/session/${sessionId}`,
      method: 'DELETE',
      response: {
        value: null
      }
    }, !persist);
  }
};

